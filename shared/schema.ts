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
  nickname: varchar("nickname", { length: 50 }),
  avatar: varchar("avatar", { length: 50 }).default("default"),
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
  routingNumber: varchar("routing_number", { length: 9 }).notNull().default("061000104"),
  debitCardNumber: varchar("debit_card_number", { length: 19 }),
  debitCardExpiry: varchar("debit_card_expiry", { length: 7 }),
  debitCardCvv: varchar("debit_card_cvv", { length: 3 }),
  debitCardType: varchar("debit_card_type", { length: 20 }),
  debitCardLocked: boolean("debit_card_locked").notNull().default(false),
  debitCardLimit: decimal("debit_card_limit", { precision: 20, scale: 2 }).notNull().default("50000"),
  creditCardNumber: varchar("credit_card_number", { length: 19 }),
  creditCardExpiry: varchar("credit_card_expiry", { length: 7 }),
  creditCardCvv: varchar("credit_card_cvv", { length: 3 }),
  creditCardType: varchar("credit_card_type", { length: 20 }),
  creditCardLocked: boolean("credit_card_locked").notNull().default(false),
  creditCardLimit: decimal("credit_card_limit", { precision: 20, scale: 2 }).notNull().default("250000"),
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
  
  // Transfer details
  transferMethod: varchar("transfer_method", { length: 50 }), // internal, domestic_wire, international_wire, ach
  beneficiaryName: text("beneficiary_name"),
  beneficiaryAccount: varchar("beneficiary_account", { length: 50 }),
  beneficiaryBank: text("beneficiary_bank"),
  routingNumber: varchar("routing_number", { length: 20 }),
  swiftCode: varchar("swift_code", { length: 20 }),
  beneficiaryAddress: text("beneficiary_address"),
  referenceNumber: varchar("reference_number", { length: 50 }),
  
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

export const domesticWireSchema = z.object({
  fromAccountId: z.number(),
  amount: z.string().min(1, "Amount is required"),
  beneficiaryName: z.string().min(1, "Beneficiary name is required"),
  beneficiaryAccount: z.string().min(1, "Beneficiary account number is required"),
  beneficiaryBank: z.string().min(1, "Beneficiary bank name is required"),
  routingNumber: z.string().min(9, "Valid routing number is required").max(9),
  beneficiaryAddress: z.string().min(1, "Beneficiary address is required"),
  description: z.string().optional(),
});

export const internationalWireSchema = z.object({
  fromAccountId: z.number(),
  amount: z.string().min(1, "Amount is required"),
  beneficiaryName: z.string().min(1, "Beneficiary name is required"),
  beneficiaryAccount: z.string().min(1, "Beneficiary account/IBAN is required"),
  beneficiaryBank: z.string().min(1, "Beneficiary bank name is required"),
  swiftCode: z.string().min(8, "Valid SWIFT/BIC code is required"),
  beneficiaryAddress: z.string().min(1, "Beneficiary address is required"),
  description: z.string().optional(),
});

export type LoginRequest = z.infer<typeof loginSchema>;
export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type UpdateBalanceRequest = z.infer<typeof updateBalanceSchema>;
export type TransferRequest = z.infer<typeof transferSchema>;
export type DomesticWireRequest = z.infer<typeof domesticWireSchema>;
export type InternationalWireRequest = z.infer<typeof internationalWireSchema>;

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
