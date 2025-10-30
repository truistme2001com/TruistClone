import { db } from "./storage";
import { users, accounts, transactions } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

function generateCardNumber(prefix: string): string {
  let cardNumber = prefix;
  for (let i = prefix.length; i < 15; i++) {
    cardNumber += Math.floor(Math.random() * 10);
  }
  let sum = 0;
  let isEven = false;
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i]);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return cardNumber + checkDigit;
}

function formatCardNumber(number: string): string {
  return number.match(/.{1,4}/g)?.join(" ") || number;
}

function generateExpiry(): string {
  const now = new Date();
  const year = now.getFullYear() + Math.floor(Math.random() * 3) + 2;
  const month = Math.floor(Math.random() * 12) + 1;
  return `${String(month).padStart(2, '0')}/${String(year).slice(-2)}`;
}

function generateCVV(): string {
  return String(Math.floor(Math.random() * 900) + 100);
}

function getRandomTime(daysAgo: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const hour = Math.floor(Math.random() * 14) + 6;
  const minute = Math.floor(Math.random() * 60);
  const second = Math.floor(Math.random() * 60);
  date.setHours(hour, minute, second, 0);
  return date;
}

async function initAccounts() {
  try {
    console.log("Initializing permanent user accounts...");
    
    const adminPassword = await bcrypt.hash("admin123", 10);
    const userPassword = await bcrypt.hash("lowry123", 10);
    
    const existingAdmin = await db.query.users.findFirst({
      where: eq(users.username, "admin")
    });
    
    if (existingAdmin) {
      await db.update(users)
        .set({ 
          password: adminPassword,
          email: "admin@truist.com",
          fullName: "System Administrator",
          isAdmin: true,
          isBlocked: false
        })
        .where(eq(users.id, existingAdmin.id));
      console.log("✓ Admin account password updated");
    } else {
      await db.insert(users).values({
        username: "admin",
        password: adminPassword,
        fullName: "System Administrator",
        email: "admin@truist.com",
        isAdmin: true,
        isBlocked: false,
      });
      console.log("✓ Admin account created");
    }
    
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, "marklowry748@gmail.com")
    });
    
    let userId: number;
    
    if (existingUser) {
      await db.update(users)
        .set({ 
          password: userPassword,
          username: "marklowry748",
          fullName: "Mark Lowry",
          isAdmin: false,
          isBlocked: false
        })
        .where(eq(users.id, existingUser.id));
      userId = existingUser.id;
      console.log("✓ Mark Lowry account password updated");
    } else {
      const [newUser] = await db.insert(users).values({
        username: "marklowry748",
        password: userPassword,
        fullName: "Mark Lowry",
        email: "marklowry748@gmail.com",
        isAdmin: false,
        isBlocked: false,
      }).returning();
      userId = newUser.id;
      console.log("✓ Mark Lowry account created");
    }
    
    const existingAccounts = await db.query.accounts.findMany({
      where: eq(accounts.userId, userId)
    });
    
    let accountId: number;
    let accountNumber: string;
    
    if (existingAccounts.length === 0) {
      accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      const debitCard = generateCardNumber("4444");
      const creditCard = generateCardNumber("5284");
      const debitExpiry = generateExpiry();
      const creditExpiry = generateExpiry();
      const debitCvv = generateCVV();
      const creditCvv = generateCVV();
      
      const [newAccount] = await db.insert(accounts).values({
        userId: userId,
        businessName: "M. Lowry Vocal Band",
        accountNumber: accountNumber,
        routingNumber: "061000104",
        debitCardNumber: formatCardNumber(debitCard),
        debitCardExpiry: debitExpiry,
        debitCardCvv: debitCvv,
        debitCardType: "Visa",
        creditCardNumber: formatCardNumber(creditCard),
        creditCardExpiry: creditExpiry,
        creditCardCvv: creditCvv,
        creditCardType: "Mastercard",
        balance: "16000000.00",
        accountType: "business checkings",
        status: "active",
      }).returning();
      
      accountId = newAccount.id;
      console.log("✓ Mark Lowry business account created");
      console.log(`  Debit Card (Visa): ${formatCardNumber(debitCard)} | Exp: ${debitExpiry} | CVV: ${debitCvv}`);
      console.log(`  Credit Card (Mastercard): ${formatCardNumber(creditCard)} | Exp: ${creditExpiry} | CVV: ${creditCvv}`);
    } else {
      const account = existingAccounts[0];
      accountId = account.id;
      accountNumber = account.accountNumber;
      
      const debitCard = account.debitCardNumber ? account.debitCardNumber.replace(/\s/g, '') : generateCardNumber("4444");
      const creditCard = account.creditCardNumber ? account.creditCardNumber.replace(/\s/g, '') : generateCardNumber("5284");
      const debitExpiry = account.debitCardExpiry || generateExpiry();
      const creditExpiry = account.creditCardExpiry || generateExpiry();
      const debitCvv = account.debitCardCvv || generateCVV();
      const creditCvv = account.creditCardCvv || generateCVV();
      
      await db.update(accounts)
        .set({
          businessName: "M. Lowry Vocal Band",
          accountType: "business checkings",
          debitCardNumber: formatCardNumber(debitCard),
          debitCardExpiry: debitExpiry,
          debitCardCvv: debitCvv,
          debitCardType: "Visa",
          creditCardNumber: formatCardNumber(creditCard),
          creditCardExpiry: creditExpiry,
          creditCardCvv: creditCvv,
          creditCardType: "Mastercard",
        })
        .where(eq(accounts.id, accountId));
      
      console.log("✓ Mark Lowry business account updated");
      console.log(`  Business Name: M. Lowry Vocal Band`);
      console.log(`  Account Type: business checkings`);
      console.log(`  Debit Card (Visa): ${formatCardNumber(debitCard)} | Exp: ${debitExpiry} | CVV: ${debitCvv}`);
      console.log(`  Credit Card (Mastercard): ${formatCardNumber(creditCard)} | Exp: ${creditExpiry} | CVV: ${creditCvv}`);
    }
    
    const existingTransactions = await db.query.transactions.findMany({
      where: eq(transactions.accountId, accountId)
    });
    
    if (existingTransactions.length === 0) {
      console.log("Creating realistic transaction history...");
      
      const transactionData = [
        { type: "credit", amount: "50000.00", description: "Wire transfer received from ABC Corp", days: 28 },
        { type: "debit", amount: "12500.00", description: "Payment to vendors", days: 27 },
        { type: "credit", amount: "75000.00", description: "Investment return", days: 25 },
        { type: "debit", amount: "8000.00", description: "Office supplies purchase", days: 23 },
        { type: "credit", amount: "100000.00", description: "Contract payment received", days: 21 },
        { type: "debit", amount: "25000.00", description: "Payroll processing", days: 20 },
        { type: "credit", amount: "60000.00", description: "Consulting fees received", days: 18 },
        { type: "debit", amount: "15000.00", description: "Equipment lease payment", days: 16 },
        { type: "credit", amount: "80000.00", description: "Sales revenue deposit", days: 14 },
        { type: "debit", amount: "20000.00", description: "Marketing campaign expenses", days: 12 },
        { type: "credit", amount: "45000.00", description: "Partnership distribution", days: 10 },
        { type: "debit", amount: "18000.00", description: "Professional services", days: 9 },
        { type: "credit", amount: "90000.00", description: "Quarterly bonus received", days: 7 },
        { type: "debit", amount: "30000.00", description: "Tax payment", days: 5 },
        { type: "credit", amount: "55000.00", description: "Rental income", days: 3 },
        { type: "debit", amount: "10000.00", description: "Insurance premium", days: 2 },
        { type: "credit", amount: "70000.00", description: "Investment dividend", days: 1 },
      ];
      
      const finalBalance = 16000000.00;
      let netChange = 0;
      
      for (const txn of transactionData) {
        if (txn.type === "credit") {
          netChange += parseFloat(txn.amount);
        } else {
          netChange -= parseFloat(txn.amount);
        }
      }
      
      let runningBalance = finalBalance - netChange;
      
      for (const txn of transactionData) {
        const txnDate = getRandomTime(txn.days);
        
        if (txn.type === "credit") {
          runningBalance += parseFloat(txn.amount);
        } else {
          runningBalance -= parseFloat(txn.amount);
        }
        
        await db.insert(transactions).values({
          accountId: accountId,
          type: txn.type as "credit" | "debit",
          amount: txn.amount,
          description: txn.description,
          balanceAfter: runningBalance.toFixed(2),
          createdAt: txnDate,
        });
      }
      
      console.log(`  Starting balance: $${(finalBalance - netChange).toFixed(2)}`);
      console.log(`  Ending balance: $${runningBalance.toFixed(2)}`);
      
      console.log("✓ Transaction history created with realistic times and correct math");
    } else {
      console.log("✓ Transaction history already exists - preserving existing data");
    }
    
    console.log("\n=== Permanent Login Credentials ===");
    console.log("Admin Account:");
    console.log("  Username: admin");
    console.log("  Password: admin123");
    console.log("  Access: Admin Dashboard");
    console.log("\nUser Account:");
    console.log("  Email/Username: marklowry748@gmail.com or marklowry748");
    console.log("  Password: lowry123");
    console.log("  Access: User Dashboard");
    console.log("===================================\n");
    
  } catch (error) {
    console.error("Error initializing accounts:", error);
  }
}

initAccounts();
