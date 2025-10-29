import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { users, accounts, transactions, sessions } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, {
  schema: { users, accounts, transactions, sessions },
});

// User operations
export async function createUser(data: {
  username: string;
  password: string;
  fullName: string;
  email?: string;
  isAdmin?: boolean;
}) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  const [user] = await db.insert(users).values({
    username: data.username,
    password: hashedPassword,
    fullName: data.fullName,
    email: data.email,
    isAdmin: data.isAdmin || false,
  }).returning();
  
  return user;
}

export async function getUserByUsername(username: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  
  return user;
}

export async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  
  return user;
}

export async function getUserByUsernameOrEmail(usernameOrEmail: string) {
  // First try to find by username
  let user = await getUserByUsername(usernameOrEmail);
  
  // If not found and input looks like an email, try email
  if (!user && usernameOrEmail.includes('@')) {
    user = await getUserByEmail(usernameOrEmail);
  }
  
  return user;
}

export async function getUserById(id: number) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  
  return user;
}

export async function getAllUsers() {
  return await db.select().from(users);
}

export async function verifyPassword(plainPassword: string, hashedPassword: string) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export async function deleteUser(userId: number) {
  await db.delete(users).where(eq(users.id, userId));
}

export async function blockUser(userId: number) {
  await db
    .update(users)
    .set({ isBlocked: true, updatedAt: new Date() })
    .where(eq(users.id, userId));
}

export async function unblockUser(userId: number) {
  await db
    .update(users)
    .set({ isBlocked: false, updatedAt: new Date() })
    .where(eq(users.id, userId));
}

// Account operations
export async function createAccount(data: {
  userId: number;
  businessName: string;
  initialBalance?: string;
}) {
  const accountNumber = generateAccountNumber();
  
  const [account] = await db.insert(accounts).values({
    userId: data.userId,
    businessName: data.businessName,
    accountNumber,
    balance: data.initialBalance || "0",
    accountType: "business",
    status: "active",
  }).returning();
  
  // Create initial transaction if there's a balance
  if (data.initialBalance && parseFloat(data.initialBalance) > 0) {
    await db.insert(transactions).values({
      accountId: account.id,
      type: "credit",
      amount: data.initialBalance,
      description: "Initial deposit",
      balanceAfter: data.initialBalance,
    });
  }
  
  return account;
}

export async function getAccountsByUserId(userId: number) {
  return await db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, userId));
}

export async function getAccountById(accountId: number) {
  const [account] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.id, accountId))
    .limit(1);
  
  return account;
}

export async function getAccountByAccountNumber(accountNumber: string) {
  const [account] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.accountNumber, accountNumber))
    .limit(1);
  
  return account;
}

export async function getAllAccounts() {
  return await db.select().from(accounts);
}

export async function updateAccountBalance(
  accountId: number,
  amount: string,
  type: "credit" | "debit",
  description?: string
) {
  const account = await getAccountById(accountId);
  if (!account) {
    throw new Error("Account not found");
  }
  
  const currentBalance = parseFloat(account.balance);
  const changeAmount = parseFloat(amount);
  
  const newBalance = type === "credit" 
    ? currentBalance + changeAmount 
    : currentBalance - changeAmount;
  
  if (newBalance < 0) {
    throw new Error("Insufficient funds");
  }
  
  // Update account balance
  await db
    .update(accounts)
    .set({ balance: newBalance.toFixed(2), updatedAt: new Date() })
    .where(eq(accounts.id, accountId));
  
  // Create transaction record
  await db.insert(transactions).values({
    accountId,
    type,
    amount,
    description: description || `${type === "credit" ? "Deposit" : "Withdrawal"}`,
    balanceAfter: newBalance.toFixed(2),
  });
  
  return newBalance.toFixed(2);
}

export async function deleteAccount(accountId: number) {
  await db.delete(transactions).where(eq(transactions.accountId, accountId));
  await db.delete(accounts).where(eq(accounts.id, accountId));
}

export async function getTransactionsByAccountId(accountId: number, limit: number = 50) {
  return await db
    .select()
    .from(transactions)
    .where(eq(transactions.accountId, accountId))
    .orderBy(desc(transactions.createdAt))
    .limit(limit);
}

export async function getUserWithAccounts(userId: number) {
  const user = await getUserById(userId);
  if (!user) return null;
  
  const userAccounts = await getAccountsByUserId(userId);
  
  return {
    ...user,
    accounts: userAccounts,
  };
}

export async function getAllUsersWithAccounts() {
  const allUsers = await getAllUsers();
  
  const usersWithAccounts = await Promise.all(
    allUsers.map(async (user) => {
      const userAccounts = await getAccountsByUserId(user.id);
      return {
        ...user,
        accounts: userAccounts,
      };
    })
  );
  
  return usersWithAccounts;
}

export async function transferFunds(
  fromAccountId: number,
  toAccountNumber: string,
  amount: string,
  description?: string
) {
  const fromAccount = await getAccountById(fromAccountId);
  if (!fromAccount) {
    throw new Error("Source account not found");
  }
  
  const toAccount = await getAccountByAccountNumber(toAccountNumber);
  if (!toAccount) {
    throw new Error("Recipient account not found");
  }
  
  if (fromAccountId === toAccount.id) {
    throw new Error("Cannot transfer to the same account");
  }
  
  const currentBalance = parseFloat(fromAccount.balance);
  const transferAmount = parseFloat(amount);
  
  if (transferAmount <= 0) {
    throw new Error("Transfer amount must be greater than zero");
  }
  
  if (currentBalance < transferAmount) {
    throw new Error("Insufficient funds");
  }
  
  const newFromBalance = currentBalance - transferAmount;
  const newToBalance = parseFloat(toAccount.balance) + transferAmount;
  
  await db
    .update(accounts)
    .set({ balance: newFromBalance.toFixed(2), updatedAt: new Date() })
    .where(eq(accounts.id, fromAccountId));
  
  await db
    .update(accounts)
    .set({ balance: newToBalance.toFixed(2), updatedAt: new Date() })
    .where(eq(accounts.id, toAccount.id));
  
  await db.insert(transactions).values({
    accountId: fromAccountId,
    type: "debit",
    amount,
    description: description || `Transfer to ${toAccount.businessName}`,
    balanceAfter: newFromBalance.toFixed(2),
  });
  
  await db.insert(transactions).values({
    accountId: toAccount.id,
    type: "credit",
    amount,
    description: description || `Transfer from ${fromAccount.businessName}`,
    balanceAfter: newToBalance.toFixed(2),
  });
  
  return {
    fromBalance: newFromBalance.toFixed(2),
    toBalance: newToBalance.toFixed(2),
  };
}

export async function domesticWireTransfer(data: {
  fromAccountId: number;
  amount: string;
  beneficiaryName: string;
  beneficiaryAccount: string;
  beneficiaryBank: string;
  routingNumber: string;
  beneficiaryAddress: string;
  description?: string;
}) {
  const fromAccount = await getAccountById(data.fromAccountId);
  if (!fromAccount) {
    throw new Error("Source account not found");
  }

  const currentBalance = parseFloat(fromAccount.balance);
  const transferAmount = parseFloat(data.amount);

  if (transferAmount <= 0) {
    throw new Error("Transfer amount must be greater than zero");
  }

  if (currentBalance < transferAmount) {
    throw new Error("Insufficient funds");
  }

  const newBalance = currentBalance - transferAmount;
  const referenceNumber = `DW${Date.now()}${Math.floor(Math.random() * 10000)}`;

  await db
    .update(accounts)
    .set({ balance: newBalance.toFixed(2), updatedAt: new Date() })
    .where(eq(accounts.id, data.fromAccountId));

  await db.insert(transactions).values({
    accountId: data.fromAccountId,
    type: "debit",
    amount: data.amount,
    description: data.description || `Domestic wire to ${data.beneficiaryName}`,
    balanceAfter: newBalance.toFixed(2),
    transferMethod: "domestic_wire",
    beneficiaryName: data.beneficiaryName,
    beneficiaryAccount: data.beneficiaryAccount,
    beneficiaryBank: data.beneficiaryBank,
    routingNumber: data.routingNumber,
    beneficiaryAddress: data.beneficiaryAddress,
    referenceNumber,
  });

  return {
    newBalance: newBalance.toFixed(2),
    referenceNumber,
  };
}

export async function internationalWireTransfer(data: {
  fromAccountId: number;
  amount: string;
  beneficiaryName: string;
  beneficiaryAccount: string;
  beneficiaryBank: string;
  swiftCode: string;
  beneficiaryAddress: string;
  description?: string;
}) {
  const fromAccount = await getAccountById(data.fromAccountId);
  if (!fromAccount) {
    throw new Error("Source account not found");
  }

  const currentBalance = parseFloat(fromAccount.balance);
  const transferAmount = parseFloat(data.amount);

  if (transferAmount <= 0) {
    throw new Error("Transfer amount must be greater than zero");
  }

  if (currentBalance < transferAmount) {
    throw new Error("Insufficient funds");
  }

  const newBalance = currentBalance - transferAmount;
  const referenceNumber = `IW${Date.now()}${Math.floor(Math.random() * 10000)}`;

  await db
    .update(accounts)
    .set({ balance: newBalance.toFixed(2), updatedAt: new Date() })
    .where(eq(accounts.id, data.fromAccountId));

  await db.insert(transactions).values({
    accountId: data.fromAccountId,
    type: "debit",
    amount: data.amount,
    description: data.description || `International wire to ${data.beneficiaryName}`,
    balanceAfter: newBalance.toFixed(2),
    transferMethod: "international_wire",
    beneficiaryName: data.beneficiaryName,
    beneficiaryAccount: data.beneficiaryAccount,
    beneficiaryBank: data.beneficiaryBank,
    swiftCode: data.swiftCode,
    beneficiaryAddress: data.beneficiaryAddress,
    referenceNumber,
  });

  return {
    newBalance: newBalance.toFixed(2),
    referenceNumber,
  };
}

// Helper function to generate account numbers
function generateAccountNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `${timestamp.slice(-10)}${random}`;
}
