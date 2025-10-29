import type { Express } from "express";
import { createServer, type Server } from "http";
import { loginSchema, type LoginResponse } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      // Demo implementation - in a real app, this would check against a database
      // For now, we'll just validate that fields are present and return success
      const response: LoginResponse = {
        success: true,
        message: "Login successful (demo mode)",
        userId: validatedData.userId,
      };

      res.json(response);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: "Invalid login data",
          errors: error,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
