import { z } from "zod";
import { pgTable, text, serial, boolean, timestamp, decimal, integer, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Database Tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: varchar("email", { length: 255 }),
  isAdmin: boolean("is_admin").notNull().default(false),
  isBlocked: boolean("is_blocked").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  businessName: text("business_name").notNull(),
  accountNumber: varchar("account_number", { length: 20 }).notNull().unique(),
  balance: decimal("balance", { precision: 20, scale: 2 }).notNull().default("0"),
  accountType: varchar("account_type", { length: 50 }).notNull().default("business"),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id").notNull().references(() => accounts.id),
  type: varchar("type", { length: 20 }).notNull(), // credit, debit, transfer
  amount: decimal("amount", { precision: 20, scale: 2 }).notNull(),
  description: text("description"),
  balanceAfter: decimal("balance_after", { precision: 20, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  sid: varchar("sid", { length: 255 }).primaryKey(),
  sess: text("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertAccountSchema = createInsertSchema(accounts);
export const selectAccountSchema = createSelectSchema(accounts);

export const insertTransactionSchema = createInsertSchema(transactions);
export const selectTransactionSchema = createSelectSchema(transactions);

// API schemas
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const createUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email").optional(),
  isAdmin: z.boolean().default(false),
  businessName: z.string().optional(),
  initialBalance: z.string().optional(),
});

export const updateBalanceSchema = z.object({
  accountId: z.number(),
  amount: z.string(),
  type: z.enum(["credit", "debit"]),
  description: z.string().optional(),
});

export const transferSchema = z.object({
  fromAccountId: z.number(),
  toAccountNumber: z.string().min(1, "Recipient account number is required"),
  amount: z.string().min(1, "Amount is required"),
  description: z.string().optional(),
});

export type LoginRequest = z.infer<typeof loginSchema>;
export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type UpdateBalanceRequest = z.infer<typeof updateBalanceSchema>;
export type TransferRequest = z.infer<typeof transferSchema>;

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    username: string;
    fullName: string;
    isAdmin: boolean;
  };
}

export interface UserWithAccount {
  id: number;
  username: string;
  fullName: string;
  email: string | null;
  isAdmin: boolean;
  isBlocked: boolean;
  createdAt: Date;
  account?: {
    id: number;
    businessName: string;
    accountNumber: string;
    balance: string;
    accountType: string;
    status: string;
  };
}

export interface Transaction {
  id: number;
  type: string;
  amount: string;
  description: string | null;
  balanceAfter: string;
  createdAt: Date;
}
