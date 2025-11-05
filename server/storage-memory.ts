// In-memory storage implementation for deployment without DATABASE_URL
import bcrypt from "bcryptjs";

// In-memory data stores
const memUsers = new Map<number, any>();
const memAccounts = new Map<number, any>();
const memTransactions = new Map<number, any>();
const memNotifications = new Map<number, any>();
const memAccountApplications = new Map<number, any>();

// ID counters
let userIdCounter = 1;
let accountIdCounter = 1;
let transactionIdCounter = 1;
let notificationIdCounter = 1;
let applicationIdCounter = 1;

// Helper function to generate account numbers (Truist format: 13 digits)
function generateAccountNumber(): string {
  const part1 = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  const part2 = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
  const part3 = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `${part1}${part2}${part3}`;
}

// Helper functions for generating card details
function generateCardNumber(): string {
  const prefix = Math.random() > 0.5 ? "4444" : "5284";
  const middle = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  const next = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  const last = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `${prefix} ${middle} ${next} ${last}`;
}

function generateExpiry(): string {
  const currentYear = new Date().getFullYear();
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const year = String((currentYear + Math.floor(Math.random() * 5) + 1) % 100).padStart(2, '0');
  return `${month}/${year}`;
}

function generateCVV(): string {
  return String(Math.floor(Math.random() * 900) + 100);
}

// User operations
export async function createUser(data: {
  username: string;
  password: string;
  fullName: string;
  email?: string;
  isAdmin?: boolean;
}) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  const user = {
    id: userIdCounter++,
    username: data.username,
    password: hashedPassword,
    fullName: data.fullName,
    email: data.email || null,
    isAdmin: data.isAdmin || false,
    isBlocked: false,
    avatar: "teddy",
    nickname: null,
    dateJoined: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  memUsers.set(user.id, user);
  return user;
}

export async function getUserByUsername(username: string) {
  return Array.from(memUsers.values()).find(u => u.username === username);
}

export async function getUserByEmail(email: string) {
  return Array.from(memUsers.values()).find(u => u.email === email);
}

export async function getUserByUsernameOrEmail(usernameOrEmail: string) {
  let user = await getUserByUsername(usernameOrEmail);
  if (!user && usernameOrEmail.includes('@')) {
    user = await getUserByEmail(usernameOrEmail);
  }
  return user;
}

export async function getUserById(id: number) {
  return memUsers.get(id);
}

export async function getAllUsers() {
  return Array.from(memUsers.values());
}

export async function verifyPassword(plainPassword: string, hashedPassword: string) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export async function deleteUser(userId: number) {
  memUsers.delete(userId);
}

export async function blockUser(userId: number) {
  const user = memUsers.get(userId);
  if (user) {
    user.isBlocked = true;
    user.updatedAt = new Date();
  }
}

export async function unblockUser(userId: number) {
  const user = memUsers.get(userId);
  if (user) {
    user.isBlocked = false;
    user.updatedAt = new Date();
  }
}

export async function updateUser(userId: number, data: {
  fullName?: string;
  email?: string;
  username?: string;
  password?: string;
  dateJoined?: Date;
}) {
  const user = memUsers.get(userId);
  if (!user) throw new Error("User not found");
  
  if (data.fullName) user.fullName = data.fullName;
  if (data.email) user.email = data.email;
  if (data.username) user.username = data.username;
  if (data.dateJoined) user.dateJoined = data.dateJoined;
  if (data.password) {
    user.password = await bcrypt.hash(data.password, 10);
  }
  user.updatedAt = new Date();
  
  return user;
}

// Account operations
export async function createAccount(data: {
  userId: number;
  businessName: string;
  initialBalance?: string;
}) {
  const accountNumber = generateAccountNumber();
  
  const account = {
    id: accountIdCounter++,
    userId: data.userId,
    businessName: data.businessName,
    accountNumber,
    routingNumber: "061000104",
    balance: data.initialBalance || "0",
    accountType: "business",
    status: "active",
    debitCardNumber: null,
    debitCardExpiry: null,
    debitCardCvv: null,
    debitCardType: null,
    debitCardLocked: false,
    debitCardLimit: "5000",
    creditCardNumber: null,
    creditCardExpiry: null,
    creditCardCvv: null,
    creditCardType: null,
    creditCardLocked: false,
    creditCardLimit: "10000",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  memAccounts.set(account.id, account);
  
  if (data.initialBalance && parseFloat(data.initialBalance) > 0) {
    await createTransaction({
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
  return Array.from(memAccounts.values()).filter(a => a.userId === userId);
}

export async function getAccountById(accountId: number) {
  return memAccounts.get(accountId);
}

export async function getAccountByAccountNumber(accountNumber: string) {
  return Array.from(memAccounts.values()).find(a => a.accountNumber === accountNumber);
}

export async function getAllAccounts() {
  return Array.from(memAccounts.values());
}

export async function updateAccountBalance(
  accountId: number,
  amount: string,
  type: "credit" | "debit",
  description?: string
) {
  const account = await getAccountById(accountId);
  if (!account) throw new Error("Account not found");
  
  const currentBalance = parseFloat(account.balance);
  const changeAmount = parseFloat(amount);
  const newBalance = type === "credit" 
    ? currentBalance + changeAmount 
    : currentBalance - changeAmount;
  
  if (newBalance < 0) throw new Error("Insufficient funds");
  
  account.balance = newBalance.toFixed(2);
  account.updatedAt = new Date();
  
  await createTransaction({
    accountId,
    type,
    amount,
    description: description || `${type === "credit" ? "Deposit" : "Withdrawal"}`,
    balanceAfter: newBalance.toFixed(2),
  });
  
  return newBalance.toFixed(2);
}

export async function deleteAccount(accountId: number) {
  // Delete associated transactions
  Array.from(memTransactions.entries()).forEach(([id, tx]) => {
    if (tx.accountId === accountId) {
      memTransactions.delete(id);
    }
  });
  memAccounts.delete(accountId);
}

function createTransaction(data: any) {
  const transaction = {
    id: transactionIdCounter++,
    ...data,
    createdAt: new Date(),
  };
  memTransactions.set(transaction.id, transaction);
  return transaction;
}

export async function getTransactionsByAccountId(accountId: number, limit: number = 50) {
  return Array.from(memTransactions.values())
    .filter(t => t.accountId === accountId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}

export async function getUserWithAccounts(userId: number) {
  const user = await getUserById(userId);
  if (!user) return null;
  const userAccounts = await getAccountsByUserId(userId);
  return { ...user, accounts: userAccounts };
}

export async function getAllUsersWithAccounts() {
  const allUsers = await getAllUsers();
  return await Promise.all(
    allUsers.map(async (user) => {
      const userAccounts = await getAccountsByUserId(user.id);
      return { ...user, accounts: userAccounts };
    })
  );
}

export async function transferFunds(
  fromAccountId: number,
  toAccountNumber: string,
  amount: string,
  description?: string
) {
  const fromAccount = await getAccountById(fromAccountId);
  if (!fromAccount) throw new Error("Source account not found");
  
  const toAccount = await getAccountByAccountNumber(toAccountNumber);
  if (!toAccount) throw new Error("Recipient account not found");
  
  if (fromAccountId === toAccount.id) {
    throw new Error("Cannot transfer to the same account");
  }
  
  const currentBalance = parseFloat(fromAccount.balance);
  const transferAmount = parseFloat(amount);
  
  if (transferAmount <= 0) throw new Error("Transfer amount must be greater than zero");
  if (currentBalance < transferAmount) throw new Error("Insufficient funds");
  
  const newFromBalance = currentBalance - transferAmount;
  const newToBalance = parseFloat(toAccount.balance) + transferAmount;
  
  fromAccount.balance = newFromBalance.toFixed(2);
  fromAccount.updatedAt = new Date();
  
  toAccount.balance = newToBalance.toFixed(2);
  toAccount.updatedAt = new Date();
  
  await createTransaction({
    accountId: fromAccountId,
    type: "debit",
    amount,
    description: description || `Transfer to ${toAccount.businessName}`,
    balanceAfter: newFromBalance.toFixed(2),
  });
  
  await createTransaction({
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

export async function domesticWireTransfer(data: any) {
  const fromAccount = await getAccountById(data.fromAccountId);
  if (!fromAccount) throw new Error("Source account not found");

  const currentBalance = parseFloat(fromAccount.balance);
  const transferAmount = parseFloat(data.amount);

  if (transferAmount <= 0) throw new Error("Transfer amount must be greater than zero");
  if (currentBalance < transferAmount) throw new Error("Insufficient funds");

  const newBalance = currentBalance - transferAmount;
  const referenceNumber = `DW${Date.now()}${Math.floor(Math.random() * 10000)}`;

  fromAccount.balance = newBalance.toFixed(2);
  fromAccount.updatedAt = new Date();

  await createTransaction({
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

export async function internationalWireTransfer(data: any) {
  const fromAccount = await getAccountById(data.fromAccountId);
  if (!fromAccount) throw new Error("Source account not found");

  const currentBalance = parseFloat(fromAccount.balance);
  const transferAmount = parseFloat(data.amount);

  if (transferAmount <= 0) throw new Error("Transfer amount must be greater than zero");
  if (currentBalance < transferAmount) throw new Error("Insufficient funds");

  const newBalance = currentBalance - transferAmount;
  const referenceNumber = `IW${Date.now()}${Math.floor(Math.random() * 10000)}`;

  fromAccount.balance = newBalance.toFixed(2);
  fromAccount.updatedAt = new Date();

  await createTransaction({
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
  const account = memAccounts.get(accountId);
  if (!account) throw new Error("Account not found");
  
  const fieldName = cardType === "debit" ? "debitCardLocked" : "creditCardLocked";
  account[fieldName] = locked;
  account.updatedAt = new Date();
  
  return { success: true, locked };
}

export async function updateCardLimit(
  accountId: number,
  cardType: "debit" | "credit",
  newLimit: string
) {
  const account = memAccounts.get(accountId);
  if (!account) throw new Error("Account not found");
  
  const fieldName = cardType === "debit" ? "debitCardLimit" : "creditCardLimit";
  account[fieldName] = newLimit;
  account.updatedAt = new Date();
  
  return { success: true, newLimit };
}

export async function updateUserAvatar(userId: number, avatar: string) {
  const user = memUsers.get(userId);
  if (!user) throw new Error("User not found");
  
  user.avatar = avatar;
  user.updatedAt = new Date();
  
  return { success: true, avatar };
}

export async function updateUserNickname(userId: number, nickname: string) {
  const user = memUsers.get(userId);
  if (!user) throw new Error("User not found");
  
  user.nickname = nickname;
  user.updatedAt = new Date();
  
  return { success: true, nickname };
}

export async function changeUserPassword(userId: number, currentPassword: string, newPassword: string) {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");
  
  const isValidPassword = await verifyPassword(currentPassword, user.password);
  if (!isValidPassword) throw new Error("Current password is incorrect");
  
  user.password = await bcrypt.hash(newPassword, 10);
  user.updatedAt = new Date();
  
  return { success: true };
}

// Notification operations
export async function createNotification(data: {
  type: string;
  title: string;
  message: string;
  userId?: number;
  relatedEntityId?: number;
}) {
  const notification = {
    id: notificationIdCounter++,
    type: data.type,
    title: data.title,
    message: data.message,
    userId: data.userId || null,
    relatedEntityId: data.relatedEntityId || null,
    isRead: false,
    createdAt: new Date(),
  };
  
  memNotifications.set(notification.id, notification);
  return notification;
}

export async function getUnreadNotifications() {
  return Array.from(memNotifications.values())
    .filter(n => !n.isRead)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getAllNotifications(limit: number = 50) {
  return Array.from(memNotifications.values())
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}

export async function markNotificationAsRead(notificationId: number) {
  const notification = memNotifications.get(notificationId);
  if (notification) {
    notification.isRead = true;
  }
}

export async function markAllNotificationsAsRead() {
  Array.from(memNotifications.values()).forEach(n => {
    if (!n.isRead) n.isRead = true;
  });
}

// Account application operations
export async function checkUsernameExists(username: string): Promise<boolean> {
  return Array.from(memUsers.values()).some(u => u.username === username);
}

export async function getPendingApplicationByUsername(username: string) {
  return Array.from(memAccountApplications.values()).find(a => a.username === username);
}

export async function getPendingApplicationByEmail(email: string) {
  return Array.from(memAccountApplications.values()).find(a => a.email === email);
}

export async function checkEmailExists(email: string): Promise<boolean> {
  return Array.from(memUsers.values()).some(u => u.email === email);
}

export async function submitAccountApplication(data: any) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  const application = {
    id: applicationIdCounter++,
    fullName: data.fullName,
    email: data.email,
    username: data.username,
    password: hashedPassword,
    phoneNumber: data.phoneNumber || null,
    dateOfBirth: data.dateOfBirth || null,
    ssnLast4: data.ssnLast4 || null,
    streetAddress: data.streetAddress || null,
    city: data.city || null,
    state: data.state || null,
    zipCode: data.zipCode || null,
    businessName: data.businessName || data.fullName,
    accountType: data.accountType,
    initialDeposit: data.initialDeposit || "0",
    status: "pending",
    declineReason: null,
    processedAt: null,
    processedBy: null,
    createdAt: new Date(),
  };
  
  memAccountApplications.set(application.id, application);
  return application;
}

export async function getAllAccountApplications() {
  return Array.from(memAccountApplications.values())
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function approveAccountApplication(applicationId: number, adminId: number) {
  const application = memAccountApplications.get(applicationId);
  if (!application) throw new Error("Application not found");
  if (application.status !== "pending") throw new Error("Application has already been processed");
  
  const newUser = await createUser({
    username: application.username,
    password: application.password,
    fullName: application.fullName,
    email: application.email,
    isAdmin: false,
  });
  
  const accountNumber = generateAccountNumber();
  const debitCardNumber = generateCardNumber();
  const debitCardExpiry = generateExpiry();
  const debitCardCvv = generateCVV();
  const creditCardNumber = generateCardNumber();
  const creditCardExpiry = generateExpiry();
  const creditCardCvv = generateCVV();
  
  const newAccount = {
    id: accountIdCounter++,
    userId: newUser.id,
    businessName: application.businessName || application.fullName,
    accountNumber: accountNumber,
    routingNumber: "061000104",
    balance: application.initialDeposit || "0",
    accountType: application.accountType,
    status: "active",
    debitCardNumber: debitCardNumber,
    debitCardExpiry: debitCardExpiry,
    debitCardCvv: debitCardCvv,
    debitCardType: "Visa",
    debitCardLocked: false,
    debitCardLimit: "5000",
    creditCardNumber: creditCardNumber,
    creditCardExpiry: creditCardExpiry,
    creditCardCvv: creditCardCvv,
    creditCardType: "Mastercard",
    creditCardLocked: false,
    creditCardLimit: "10000",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  memAccounts.set(newAccount.id, newAccount);
  
  application.status = "approved";
  application.processedAt = new Date();
  application.processedBy = adminId;
  
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
  const application = memAccountApplications.get(applicationId);
  if (!application) throw new Error("Application not found");
  if (application.status !== "pending") throw new Error("Application has already been processed");
  
  application.status = "declined";
  application.declineReason = reason || "Application did not meet requirements";
  application.processedAt = new Date();
  application.processedBy = adminId;
}

export async function updateAccountsWithMissingCardDetails() {
  const allAccounts = await getAllAccounts();
  let updatedCount = 0;
  
  for (const account of allAccounts) {
    let updated = false;
    
    if (!account.debitCardCvv || !account.debitCardNumber) {
      account.debitCardNumber = generateCardNumber();
      account.debitCardExpiry = generateExpiry();
      account.debitCardCvv = generateCVV();
      account.debitCardType = "Visa";
      if (!account.debitCardLimit) {
        account.debitCardLimit = "5000";
      }
      updated = true;
    }
    
    if (!account.creditCardCvv || !account.creditCardNumber) {
      account.creditCardNumber = generateCardNumber();
      account.creditCardExpiry = generateExpiry();
      account.creditCardCvv = generateCVV();
      account.creditCardType = "Mastercard";
      if (!account.creditCardLimit) {
        account.creditCardLimit = "10000";
      }
      updated = true;
    }
    
    if (updated) {
      updatedCount++;
    }
  }
  
  return updatedCount;
}

export async function getAllTransactions(limit: number = 100) {
  return Array.from(memTransactions.values())
    .map(tx => {
      const account = memAccounts.get(tx.accountId);
      return {
        ...tx,
        accountNumber: account?.accountNumber || null,
        businessName: account?.businessName || null,
      };
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}

// Mock db export for compatibility
export const db = null;
