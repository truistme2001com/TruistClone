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
  blockUser,
  unblockUser,
  updateUser,
  transferFunds,
  domesticWireTransfer,
  internationalWireTransfer,
  toggleCardLock,
  updateCardLimit,
  updateUserAvatar,
  updateUserNickname,
  changeUserPassword,
} from "./storage";
import { loginSchema, createUserSchema, updateUserSchema, updateBalanceSchema, transferSchema, domesticWireSchema, internationalWireSchema } from "@shared/schema";

// Middleware to check if regular user is authenticated
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  
  const user = req.user as any;
  if (user?.isBlocked) {
    return res.status(403).json({ 
      success: false, 
      message: "Your account access has been blocked by the administrator. Please contact Truist Bank support for assistance.",
      blocked: true
    });
  }
  
  return next();
}

// Middleware to check if admin is authenticated
function isAdmin(req: Request, res: Response, next: Function) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  
  const user = req.user as any;
  if (user?.isBlocked) {
    return res.status(403).json({ 
      success: false, 
      message: "Your account access has been blocked by the administrator. Please contact Truist Bank support for assistance.",
      blocked: true
    });
  }
  
  if (!user?.isAdmin) {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  
  return next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin authentication routes
  app.post("/api/admin-login", (req, res, next) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      passport.authenticate("admin-local", (err: any, user: any, info: any) => {
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
            message: "Admin login successful",
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

  app.post("/api/admin-logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Logout failed" });
      }
      res.json({ success: true, message: "Logged out successfully" });
    });
  });

  app.get("/api/admin-me", isAdmin, async (req, res) => {
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

  // Admin profile update routes
  app.post("/api/admin/profile/update-avatar", isAdmin, async (req, res) => {
    try {
      const user = req.user as any;
      const { avatar } = req.body;
      
      if (!avatar) {
        return res.status(400).json({ success: false, message: "Avatar is required" });
      }
      
      await updateUserAvatar(user.id, avatar);
      res.json({ success: true, message: "Avatar updated successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Failed to update avatar" });
    }
  });

  app.post("/api/admin/profile/update-nickname", isAdmin, async (req, res) => {
    try {
      const user = req.user as any;
      const { nickname } = req.body;
      
      await updateUserNickname(user.id, nickname || "");
      res.json({ success: true, message: "Nickname updated successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Failed to update nickname" });
    }
  });

  app.post("/api/admin/profile/change-password", isAdmin, async (req, res) => {
    try {
      const user = req.user as any;
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: "Current and new passwords are required" });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
      }
      
      await changeUserPassword(user.id, currentPassword, newPassword);
      res.json({ success: true, message: "Password changed successfully" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || "Failed to change password" });
    }
  });

  // Regular user authentication routes
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

  // Profile update routes
  app.post("/api/profile/update-avatar", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const { avatar } = req.body;
      
      if (!avatar) {
        return res.status(400).json({ success: false, message: "Avatar is required" });
      }
      
      await updateUserAvatar(user.id, avatar);
      res.json({ success: true, message: "Avatar updated successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Failed to update avatar" });
    }
  });

  app.post("/api/profile/update-nickname", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const { nickname } = req.body;
      
      await updateUserNickname(user.id, nickname || "");
      res.json({ success: true, message: "Nickname updated successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Failed to update nickname" });
    }
  });

  app.post("/api/profile/change-password", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: "Current and new passwords are required" });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
      }
      
      await changeUserPassword(user.id, currentPassword, newPassword);
      res.json({ success: true, message: "Password changed successfully" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || "Failed to change password" });
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
      
      // Create notification for new user creation
      const { createNotification } = await import("./storage");
      await createNotification({
        type: "user_created",
        title: "New User Created",
        message: `User ${user.fullName} (@${user.username}) has been created${account ? ` with account ${account.accountNumber}` : ''}`,
        userId: user.id,
        relatedEntityId: user.id,
      });
      
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
      
      // Create notification for balance update
      const { createNotification, getAccountById } = await import("./storage");
      const account = await getAccountById(accountId);
      const actionType = data.type === "credit" ? "credited" : "debited";
      const formattedAmount = parseFloat(data.amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      
      await createNotification({
        type: "balance_update",
        title: `Account ${actionType.charAt(0).toUpperCase() + actionType.slice(1)}`,
        message: `Account ${account?.accountNumber} was ${actionType} ${formattedAmount}. New balance: ${parseFloat(newBalance).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`,
        userId: account?.userId,
        relatedEntityId: accountId,
      });
      
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

  app.post("/api/admin/users/:userId/block", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      await blockUser(userId);
      res.json({ success: true, message: "User blocked successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/admin/users/:userId/unblock", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      await unblockUser(userId);
      res.json({ success: true, message: "User unblocked successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/admin/users/:userId/update", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const data = updateUserSchema.parse({ ...req.body, userId });
      
      const updateData: any = {};
      if (data.fullName) updateData.fullName = data.fullName;
      if (data.email) updateData.email = data.email;
      if (data.username) updateData.username = data.username;
      if (data.password) updateData.password = data.password;
      if (data.dateJoined) updateData.dateJoined = new Date(data.dateJoined);
      
      const updatedUser = await updateUser(userId, updateData);
      
      const { password, ...userInfo } = updatedUser;
      res.json({ 
        success: true, 
        message: "User updated successfully",
        user: userInfo
      });
    } catch (error: any) {
      res.status(400).json({ 
        success: false, 
        message: error.message || "Failed to update user" 
      });
    }
  });

  app.post("/api/transfer", isAuthenticated, async (req, res) => {
    try {
      const currentUser = req.user as any;
      const data = transferSchema.parse(req.body);
      
      const account = await getAccountById(data.fromAccountId);
      if (!account || account.userId !== currentUser.id) {
        return res.status(403).json({ 
          success: false, 
          message: "Unauthorized" 
        });
      }
      
      const result = await transferFunds(
        data.fromAccountId,
        data.toAccountNumber,
        data.amount,
        data.description
      );
      
      res.json({
        success: true,
        message: "Transfer successful",
        newBalance: result.fromBalance,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Transfer failed",
      });
    }
  });

  app.post("/api/transfer/domestic-wire", isAuthenticated, async (req, res) => {
    try {
      const currentUser = req.user as any;
      const data = domesticWireSchema.parse(req.body);
      
      const account = await getAccountById(data.fromAccountId);
      if (!account || account.userId !== currentUser.id) {
        return res.status(403).json({ 
          success: false, 
          message: "Unauthorized" 
        });
      }
      
      const result = await domesticWireTransfer(data);
      
      res.json({
        success: true,
        message: "Domestic wire transfer successful",
        newBalance: result.newBalance,
        referenceNumber: result.referenceNumber,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Wire transfer failed",
      });
    }
  });

  app.post("/api/transfer/international-wire", isAuthenticated, async (req, res) => {
    try {
      const currentUser = req.user as any;
      const data = internationalWireSchema.parse(req.body);
      
      const account = await getAccountById(data.fromAccountId);
      if (!account || account.userId !== currentUser.id) {
        return res.status(403).json({ 
          success: false, 
          message: "Unauthorized" 
        });
      }
      
      const result = await internationalWireTransfer(data);
      
      res.json({
        success: true,
        message: "International wire transfer successful",
        newBalance: result.newBalance,
        referenceNumber: result.referenceNumber,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Wire transfer failed",
      });
    }
  });

  app.post("/api/cards/toggle-lock", isAuthenticated, async (req, res) => {
    try {
      const currentUser = req.user as any;
      const { accountId, cardType, locked } = req.body;
      
      if (!accountId || !cardType || typeof locked !== "boolean") {
        return res.status(400).json({ 
          success: false, 
          message: "Missing required fields" 
        });
      }
      
      const account = await getAccountById(accountId);
      if (!account || account.userId !== currentUser.id) {
        return res.status(403).json({ 
          success: false, 
          message: "Unauthorized" 
        });
      }
      
      const result = await toggleCardLock(accountId, cardType, locked);
      
      res.json({
        success: true,
        message: locked ? "Card locked successfully" : "Card unlocked successfully",
        locked: result.locked,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to toggle card lock",
      });
    }
  });

  app.post("/api/cards/update-limit", isAuthenticated, async (req, res) => {
    try {
      const currentUser = req.user as any;
      const { accountId, cardType, newLimit } = req.body;
      
      if (!accountId || !cardType || !newLimit) {
        return res.status(400).json({ 
          success: false, 
          message: "Missing required fields" 
        });
      }
      
      const account = await getAccountById(accountId);
      if (!account || account.userId !== currentUser.id) {
        return res.status(403).json({ 
          success: false, 
          message: "Unauthorized" 
        });
      }
      
      const result = await updateCardLimit(accountId, cardType, newLimit);
      
      res.json({
        success: true,
        message: "Card limit updated successfully",
        newLimit: result.newLimit,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update card limit",
      });
    }
  });

  // Notification routes
  app.get("/api/notifications", isAdmin, async (req, res) => {
    try {
      const { getUnreadNotifications, getAllNotifications } = await import("./storage");
      const unreadOnly = req.query.unreadOnly === "true";
      
      const notifications = unreadOnly 
        ? await getUnreadNotifications()
        : await getAllNotifications();
      
      res.json({
        success: true,
        notifications,
        unreadCount: unreadOnly ? notifications.length : notifications.filter((n: any) => !n.isRead).length,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch notifications",
      });
    }
  });

  app.post("/api/notifications/:id/read", isAdmin, async (req, res) => {
    try {
      const { markNotificationAsRead } = await import("./storage");
      const notificationId = parseInt(req.params.id);
      
      await markNotificationAsRead(notificationId);
      
      res.json({
        success: true,
        message: "Notification marked as read",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to mark notification as read",
      });
    }
  });

  app.post("/api/notifications/read-all", isAdmin, async (req, res) => {
    try {
      const { markAllNotificationsAsRead } = await import("./storage");
      
      await markAllNotificationsAsRead();
      
      res.json({
        success: true,
        message: "All notifications marked as read",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to mark all notifications as read",
      });
    }
  });

  // Admin balance management routes
  app.get("/api/admin/account", isAdmin, async (req, res) => {
    try {
      const { getAccountsByUserId } = await import("./storage");
      const currentUser = req.user as any;
      
      const accounts = await getAccountsByUserId(currentUser.id);
      const adminAccount = accounts.length > 0 ? accounts[0] : null;
      
      res.json({
        success: true,
        account: adminAccount,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch admin account",
      });
    }
  });

  app.post("/api/admin/account/add-funds", isAdmin, async (req, res) => {
    try {
      const { getAccountsByUserId } = await import("./storage");
      const { updateAccountBalance } = await import("./storage");
      const currentUser = req.user as any;
      const { amount, description } = req.body;
      
      if (!amount || parseFloat(amount) <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid amount",
        });
      }
      
      const accounts = await getAccountsByUserId(currentUser.id);
      if (accounts.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Admin account not found",
        });
      }
      
      const adminAccount = accounts[0];
      await updateAccountBalance(adminAccount.id, amount, "credit", description || "Admin funds added");
      
      res.json({
        success: true,
        message: "Funds added successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to add funds",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
