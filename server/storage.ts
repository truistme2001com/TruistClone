import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users, accounts, transactions, sessions, notifications, accountApplications, pendingTransfers } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const sql = postgres(process.env.DATABASE_URL);
export const db = drizzle(sql, {
  schema: { users, accounts, transactions, sessions, notifications, accountApplications, pendingTransfers },
  casing: 'snake_case',
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

export async function updateUser(userId: number, data: {
  fullName?: string;
  email?: string;
  username?: string;
  password?: string;
  dateJoined?: Date;
}) {
  const updateData: any = { updatedAt: new Date() };
  
  if (data.fullName) updateData.fullName = data.fullName;
  if (data.email) updateData.email = data.email;
  if (data.username) updateData.username = data.username;
  if (data.dateJoined) updateData.dateJoined = data.dateJoined;
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }
  
  const [updatedUser] = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, userId))
    .returning();
  
  return updatedUser;
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

export async function toggleCardLock(
  accountId: number,
  cardType: "debit" | "credit",
  locked: boolean
) {
  const fieldName = cardType === "debit" ? "debitCardLocked" : "creditCardLocked";
  
  await db
    .update(accounts)
    .set({ [fieldName]: locked, updatedAt: new Date() })
    .where(eq(accounts.id, accountId));
  
  return { success: true, locked };
}

export async function updateCardLimit(
  accountId: number,
  cardType: "debit" | "credit",
  newLimit: string
) {
  const fieldName = cardType === "debit" ? "debitCardLimit" : "creditCardLimit";
  
  await db
    .update(accounts)
    .set({ [fieldName]: newLimit, updatedAt: new Date() })
    .where(eq(accounts.id, accountId));
  
  return { success: true, newLimit };
}

export async function updateUserAvatar(userId: number, avatar: string) {
  await db
    .update(users)
    .set({ avatar, updatedAt: new Date() })
    .where(eq(users.id, userId));
  
  return { success: true, avatar };
}

export async function updateUserNickname(userId: number, nickname: string) {
  await db
    .update(users)
    .set({ nickname, updatedAt: new Date() })
    .where(eq(users.id, userId));
  
  return { success: true, nickname };
}

export async function changeUserPassword(userId: number, currentPassword: string, newPassword: string) {
  const user = await getUserById(userId);
  
  if (!user) {
    throw new Error("User not found");
  }
  
  const isValidPassword = await verifyPassword(currentPassword, user.password);
  if (!isValidPassword) {
    throw new Error("Current password is incorrect");
  }
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  await db
    .update(users)
    .set({ password: hashedPassword, updatedAt: new Date() })
    .where(eq(users.id, userId));
  
  return { success: true };
}

// Helper function to generate account numbers (Truist format: 13 digits)
function generateAccountNumber(): string {
  const part1 = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  const part2 = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
  const part3 = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `${part1}${part2}${part3}`;
}

// Notification operations
export async function createNotification(data: {
  type: string;
  title: string;
  message: string;
  userId?: number;
  relatedEntityId?: number;
}) {
  const [notification] = await db.insert(notifications).values({
    type: data.type,
    title: data.title,
    message: data.message,
    userId: data.userId,
    relatedEntityId: data.relatedEntityId,
    isRead: false,
  }).returning();
  
  return notification;
}

export async function getUnreadNotifications() {
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.isRead, false))
    .orderBy(desc(notifications.createdAt));
}

export async function getAllNotifications(limit: number = 50) {
  return db
    .select()
    .from(notifications)
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function markNotificationAsRead(notificationId: number) {
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.id, notificationId));
}

export async function markAllNotificationsAsRead() {
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.isRead, false));
}

// Account application operations
export async function checkUsernameExists(username: string): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username)
  });
  return !!user;
}

export async function checkEmailExists(email: string): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email)
  });
  return !!user;
}

export async function submitAccountApplication(data: {
  fullName: string;
  email: string;
  username: string;
  password: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  ssnLast4?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  businessName?: string;
  accountType: string;
  initialDeposit?: string;
}) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  const [application] = await db.insert(accountApplications).values({
    fullName: data.fullName,
    email: data.email,
    username: data.username,
    password: hashedPassword,
    phoneNumber: data.phoneNumber,
    dateOfBirth: data.dateOfBirth,
    ssnLast4: data.ssnLast4,
    streetAddress: data.streetAddress,
    city: data.city,
    state: data.state,
    zipCode: data.zipCode,
    businessName: data.businessName || data.fullName,
    accountType: data.accountType,
    initialDeposit: data.initialDeposit || "0",
    status: "pending",
  }).returning();
  
  return application;
}

export async function getAllAccountApplications() {
  return db
    .select()
    .from(accountApplications)
    .orderBy(desc(accountApplications.createdAt));
}

export async function approveAccountApplication(applicationId: number, adminId: number) {
  const application = await db.query.accountApplications.findFirst({
    where: eq(accountApplications.id, applicationId)
  });
  
  if (!application) {
    throw new Error("Application not found");
  }
  
  if (application.status !== "pending") {
    throw new Error("Application has already been processed");
  }
  
  // Create user and account
  const [newUser] = await db.insert(users).values({
    username: application.username,
    password: application.password, // Already hashed
    fullName: application.fullName,
    email: application.email,
    isAdmin: false,
    isBlocked: false,
  }).returning();
  
  const accountNumber = generateAccountNumber();
  const [newAccount] = await db.insert(accounts).values({
    userId: newUser.id,
    businessName: application.businessName || application.fullName,
    accountNumber: accountNumber,
    routingNumber: "061000104", // Truist routing number
    balance: application.initialDeposit || "0",
    accountType: application.accountType,
    status: "active",
  }).returning();
  
  // Update application status
  await db
    .update(accountApplications)
    .set({
      status: "approved",
      processedAt: new Date(),
      processedBy: adminId,
    })
    .where(eq(accountApplications.id, applicationId));
  
  // Create notification
  await createNotification({
    type: "account_approved",
    title: "Account Approved",
    message: `New account created for ${application.fullName}. Account #${accountNumber}`,
    relatedEntityId: newUser.id,
  });
  
  return {
    user: newUser,
    account: newAccount,
    accountNumber,
  };
}

export async function declineAccountApplication(applicationId: number, adminId: number, reason?: string) {
  const application = await db.query.accountApplications.findFirst({
    where: eq(accountApplications.id, applicationId)
  });
  
  if (!application) {
    throw new Error("Application not found");
  }
  
  if (application.status !== "pending") {
    throw new Error("Application has already been processed");
  }
  
  await db
    .update(accountApplications)
    .set({
      status: "declined",
      declineReason: reason || "Application did not meet requirements",
      processedAt: new Date(),
      processedBy: adminId,
    })
    .where(eq(accountApplications.id, applicationId));
}

export async function getAllTransactions(limit: number = 100) {
  return db
    .select({
      id: transactions.id,
      accountId: transactions.accountId,
      type: transactions.type,
      amount: transactions.amount,
      description: transactions.description,
      balanceAfter: transactions.balanceAfter,
      transferMethod: transactions.transferMethod,
      beneficiaryName: transactions.beneficiaryName,
      createdAt: transactions.createdAt,
      accountNumber: accounts.accountNumber,
      businessName: accounts.businessName,
    })
    .from(transactions)
    .leftJoin(accounts, eq(transactions.accountId, accounts.id))
    .orderBy(desc(transactions.createdAt))
    .limit(limit);
}
