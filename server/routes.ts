import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import {
  createUser,
  createAccount,
  getUserWithAccounts,
  getAllUsersWithAccounts,
  updateAccountBalance,
  getTransactionsByAccountId,
  getAccountById,
  deleteUser,
  deleteAccount,
} from "./storage";
import { loginSchema, createUserSchema, updateBalanceSchema } from "@shared/schema";

// Middleware to check if user is authenticated
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ success: false, message: "Not authenticated" });
}

// Middleware to check if user is admin
function isAdmin(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated() && (req.user as any)?.isAdmin) {
    return next();
  }
  res.status(403).json({ success: false, message: "Admin access required" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/login", (req, res, next) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Server error" });
        }
        
        if (!user) {
          return res.status(401).json({ 
            success: false, 
            message: info?.message || "Invalid credentials" 
          });
        }
        
        req.logIn(user, (err) => {
          if (err) {
            return res.status(500).json({ success: false, message: "Login failed" });
          }
          
          return res.json({
            success: true,
            message: "Login successful",
            user: {
              id: user.id,
              username: user.username,
              fullName: user.fullName,
              isAdmin: user.isAdmin,
            },
          });
        });
      })(req, res, next);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Invalid login data",
      });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Logout failed" });
      }
      res.json({ success: true, message: "Logged out successfully" });
    });
  });

  app.get("/api/me", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const userWithAccounts = await getUserWithAccounts(user.id);
      
      if (!userWithAccounts) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userInfo } = userWithAccounts;
      res.json({ success: true, user: userInfo });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  // Admin routes - User management
  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const users = await getAllUsersWithAccounts();
      // Remove passwords
      const sanitizedUsers = users.map(({ password, ...user }) => user);
      res.json({ success: true, users: sanitizedUsers });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  app.post("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const data = createUserSchema.parse(req.body);
      
      // Create user
      const user = await createUser({
        username: data.username,
        password: data.password,
        fullName: data.fullName,
        email: data.email,
        isAdmin: data.isAdmin,
      });
      
      // Create account if business name provided
      let account = null;
      if (data.businessName) {
        account = await createAccount({
          userId: user.id,
          businessName: data.businessName,
          initialBalance: data.initialBalance || "0",
        });
      }
      
      res.json({
        success: true,
        message: "User created successfully",
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          isAdmin: user.isAdmin,
        },
        account,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create user",
      });
    }
  });

  app.delete("/api/admin/users/:userId", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      await deleteUser(userId);
      res.json({ success: true, message: "User deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Account management
  app.get("/api/accounts/:accountId/transactions", isAuthenticated, async (req, res) => {
    try {
      const accountId = parseInt(req.params.accountId);
      const limit = parseInt(req.query.limit as string) || 50;
      const currentUser = req.user as any;
      
      // Fetch the account first
      const account = await getAccountById(accountId);
      
      // Return 404 if account doesn't exist or user doesn't own it (prevents account enumeration)
      if (!account) {
        return res.status(404).json({ 
          success: false, 
          message: "Account not found" 
        });
      }
      
      // Allow access if user owns the account OR is admin
      if (account.userId !== currentUser.id && !currentUser.isAdmin) {
        return res.status(404).json({ 
          success: false, 
          message: "Account not found" 
        });
      }
      
      const transactions = await getTransactionsByAccountId(accountId, limit);
      res.json({ success: true, transactions });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  app.post("/api/admin/accounts/:accountId/balance", isAdmin, async (req, res) => {
    try {
      const accountId = parseInt(req.params.accountId);
      const data = updateBalanceSchema.parse({
        ...req.body,
        accountId,
      });
      
      const newBalance = await updateAccountBalance(
        accountId,
        data.amount,
        data.type,
        data.description
      );
      
      res.json({
        success: true,
        message: "Balance updated successfully",
        newBalance,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update balance",
      });
    }
  });

  app.delete("/api/admin/accounts/:accountId", isAdmin, async (req, res) => {
    try {
      const accountId = parseInt(req.params.accountId);
      await deleteAccount(accountId);
      res.json({ success: true, message: "Account deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
