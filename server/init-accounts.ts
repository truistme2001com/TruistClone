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

function getRandomTime(daysAgo: number, hour?: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const txnHour = hour !== undefined ? hour : Math.floor(Math.random() * 14) + 6;
  const minute = Math.floor(Math.random() * 60);
  const second = Math.floor(Math.random() * 60);
  date.setHours(txnHour, minute, second, 0);
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
      // Only update critical security fields and password, preserve ALL user customizations including avatar
      await db.update(users)
        .set({ 
          password: adminPassword,
          isAdmin: true,
          isBlocked: false
        })
        .where(eq(users.id, existingAdmin.id));
      console.log("✓ Admin account verified (password reset, avatar and other customizations preserved)");
    } else {
      await db.insert(users).values({
        username: "admin",
        password: adminPassword,
        fullName: "System Administrator",
        email: "admin@truist.com",
        avatar: "owl",
        isAdmin: true,
        isBlocked: false,
      });
      console.log("✓ Admin account created with owl avatar");
    }
    
    // Create or preserve admin account with balance
    const adminUser = await db.query.users.findFirst({
      where: eq(users.username, "admin")
    });
    
    if (adminUser) {
      const existingAdminAccounts = await db.query.accounts.findMany({
        where: eq(accounts.userId, adminUser.id)
      });
      
      if (existingAdminAccounts.length === 0) {
        // Create admin account with initial balance
        await db.insert(accounts).values({
          userId: adminUser.id,
          businessName: "Admin Operations Account",
          accountNumber: "1000000000001",
          routingNumber: "061000104",
          balance: "1000000.00",
          accountType: "admin operations",
          status: "active",
        });
        console.log("✓ Admin operations account created with $1,000,000.00");
      } else {
        console.log("✓ Admin operations account exists (balance preserved)");
      }
    }
    
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, "marklowry748@gmail.com")
    });
    
    let userId: number;
    
    if (existingUser) {
      // Only update critical security fields and password, preserve ALL user customizations including avatar
      await db.update(users)
        .set({ 
          password: userPassword,
          isAdmin: false,
          isBlocked: false
        })
        .where(eq(users.id, existingUser.id));
      userId = existingUser.id;
      console.log("✓ Mark Lowry account verified (password reset, avatar and other customizations preserved)");
    } else {
      const [newUser] = await db.insert(users).values({
        username: "marklowry748",
        password: userPassword,
        fullName: "Mark Lowry",
        email: "marklowry748@gmail.com",
        isAdmin: false,
        isBlocked: false,
        dateJoined: new Date("2019-08-11"),
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
      accountNumber = "4729186503421";
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
      accountNumber = "4729186503421";
      
      const debitCard = account.debitCardNumber ? account.debitCardNumber.replace(/\s/g, '') : generateCardNumber("4444");
      const creditCard = account.creditCardNumber ? account.creditCardNumber.replace(/\s/g, '') : generateCardNumber("5284");
      const debitExpiry = account.debitCardExpiry || generateExpiry();
      const creditExpiry = account.creditCardExpiry || generateExpiry();
      const debitCvv = account.debitCardCvv || generateCVV();
      const creditCvv = account.creditCardCvv || generateCVV();
      
      await db.update(accounts)
        .set({
          businessName: "M. Lowry Vocal Band",
          accountNumber: accountNumber,
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
        { type: "credit", amount: "50000.00", description: "Wire transfer received from ABC Corp", days: 28, hour: 9 },
        
        { type: "debit", amount: "12500.00", description: "Payment to vendors", days: 27, hour: 10 },
        { type: "debit", amount: "3200.00", description: "Amazon Business - Office supplies", days: 27, hour: 14 },
        
        { type: "credit", amount: "75000.00", description: "Investment return", days: 25, hour: 11 },
        
        { type: "debit", amount: "8000.00", description: "Office Depot - Furniture", days: 23, hour: 15 },
        { type: "debit", amount: "1450.00", description: "AT&T - Business Internet", days: 23, hour: 16 },
        { type: "debit", amount: "890.00", description: "Starbucks - Team meeting", days: 23, hour: 8 },
        
        { type: "credit", amount: "100000.00", description: "Contract payment received", days: 21, hour: 13 },
        { type: "credit", amount: "45000.00", description: "Client retainer fee", days: 21, hour: 15 },
        
        { type: "debit", amount: "25000.00", description: "Payroll processing", days: 20, hour: 9 },
        
        { type: "credit", amount: "60000.00", description: "Consulting fees received", days: 18, hour: 10 },
        
        { type: "debit", amount: "15000.00", description: "Equipment lease payment", days: 16, hour: 12 },
        { type: "debit", amount: "5600.00", description: "Adobe Creative Cloud - Annual", days: 16, hour: 14 },
        
        { type: "credit", amount: "80000.00", description: "Sales revenue deposit", days: 14, hour: 11 },
        { type: "credit", amount: "22000.00", description: "Commission payment", days: 14, hour: 13 },
        
        { type: "debit", amount: "20000.00", description: "Marketing campaign expenses", days: 12, hour: 10 },
        { type: "debit", amount: "7500.00", description: "Google Ads - Monthly budget", days: 12, hour: 11 },
        { type: "debit", amount: "4200.00", description: "Facebook Ads - Campaign", days: 12, hour: 15 },
        
        { type: "credit", amount: "90000.00", description: "Quarterly bonus received", days: 10, hour: 9 },
        
        { type: "debit", amount: "18000.00", description: "Professional services", days: 9, hour: 14 },
        { type: "debit", amount: "2100.00", description: "FedEx - Shipping charges", days: 9, hour: 16 },
        
        { type: "debit", amount: "30000.00", description: "Tax payment", days: 7, hour: 10 },
        
        { type: "debit", amount: "8900.00", description: "Best Buy - New laptops", days: 5, hour: 13 },
        { type: "debit", amount: "1200.00", description: "Costco - Office snacks", days: 5, hour: 15 },
        { type: "debit", amount: "750.00", description: "Uber for Business", days: 5, hour: 17 },
        
        { type: "credit", amount: "55000.00", description: "Rental income", days: 3, hour: 11 },
        
        { type: "debit", amount: "10000.00", description: "Insurance premium", days: 2, hour: 9 },
        { type: "debit", amount: "3400.00", description: "Microsoft 365 - Annual renewal", days: 2, hour: 12 },
        
        { type: "credit", amount: "70000.00", description: "Investment dividend", days: 1, hour: 10 },
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
        const txnDate = getRandomTime(txn.days, txn.hour);
        
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
