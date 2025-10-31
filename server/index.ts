import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { getUserByUsernameOrEmail, getUserById, verifyPassword } from "./storage";
import connectPgSimple from "connect-pg-simple";
import { neon } from "@neondatabase/serverless";

const app = express();

// Session store setup
const PgSession = connectPgSimple(session);
const pgClient = neon(process.env.DATABASE_URL!);

// Admin Passport instance with separate serialization
const adminPassport = new passport.Passport();
adminPassport.use('admin-local',
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await getUserByUsernameOrEmail(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username/email or password" });
      }

      if (!user.isAdmin) {
        return done(null, false, { message: "Admin access required" });
      }

      if (user.isBlocked) {
        return done(null, false, { message: "Account has been blocked. Please contact support." });
      }

      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return done(null, false, { message: "Incorrect username/email or password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

adminPassport.serializeUser((user: any, done) => {
  done(null, { id: user.id, type: 'admin' });
});

adminPassport.deserializeUser(async (data: any, done) => {
  try {
    const user = await getUserById(data.id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// User Passport instance with separate serialization
const userPassport = new passport.Passport();
userPassport.use('user-local',
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await getUserByUsernameOrEmail(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username/email or password" });
      }

      if (user.isBlocked) {
        return done(null, false, { message: "Account has been blocked. Please contact support." });
      }

      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return done(null, false, { message: "Incorrect username/email or password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

userPassport.serializeUser((user: any, done) => {
  done(null, { id: user.id, type: 'user' });
});

userPassport.deserializeUser(async (data: any, done) => {
  try {
    const user = await getUserById(data.id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Export passport instances for use in routes
export { adminPassport, userPassport };

// Middleware
declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}

declare module 'express-session' {
  interface SessionData {
    passport?: any;
  }
}

app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// Admin session middleware with separate cookie
const adminSessionMiddleware = session({
  store: new PgSession({
    conObject: {
      connectionString: process.env.DATABASE_URL,
    },
    tableName: "admin_sessions",
    createTableIfMissing: true,
  }),
  name: 'admin.sid',
  secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});

// User session middleware with separate cookie
const userSessionMiddleware = session({
  store: new PgSession({
    conObject: {
      connectionString: process.env.DATABASE_URL,
    },
    tableName: "user_sessions",
    createTableIfMissing: true,
  }),
  name: 'user.sid',
  secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});

// Apply sessions based on route
app.use((req, res, next) => {
  if (req.path.startsWith('/api/admin') || 
      req.path === '/api/admin-login' || 
      req.path === '/api/admin-logout' || 
      req.path === '/api/admin-me') {
    return adminSessionMiddleware(req, res, () => {
      adminPassport.initialize()(req, res, () => {
        adminPassport.session()(req, res, next);
      });
    });
  } else {
    return userSessionMiddleware(req, res, () => {
      userPassport.initialize()(req, res, () => {
        userPassport.session()(req, res, next);
      });
    });
  }
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await import("./init-accounts");
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
