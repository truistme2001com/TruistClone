import { createUser, createAccount, getUserByEmail, getAccountsByUserId } from "./storage";
import { db } from "./storage";
import { transactions } from "@shared/schema";

async function setupUser() {
  try {
    const email = "marklowry748@gmail.com";
    const password = "lowry123";
    const balance = "16000000.00";
    
    let user = await getUserByEmail(email);
    
    if (!user) {
      console.log("Creating user...");
      user = await createUser({
        username: "marklowry748",
        password: password,
        fullName: "Mark Lowry",
        email: email,
        isAdmin: true,
      });
      console.log("User created successfully!");
    } else {
      console.log("User already exists!");
    }
    
    let accounts = await getAccountsByUserId(user.id);
    let account;
    
    if (accounts.length === 0) {
      console.log("Creating account...");
      account = await createAccount({
        userId: user.id,
        businessName: "Mark Lowry Business Account",
        initialBalance: balance,
      });
      console.log("Account created with balance: $" + balance);
    } else {
      account = accounts[0];
      console.log("Account already exists with balance: $" + account.balance);
    }
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const sampleTransactions = [
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
    
    console.log("Adding transaction history for the past month...");
    
    let runningBalance = parseFloat(balance);
    
    for (const txn of sampleTransactions.reverse()) {
      const txnDate = new Date();
      txnDate.setDate(txnDate.getDate() - txn.days);
      
      if (txn.type === "credit") {
        runningBalance -= parseFloat(txn.amount);
      } else {
        runningBalance += parseFloat(txn.amount);
      }
      
      await db.insert(transactions).values({
        accountId: account.id,
        type: txn.type as "credit" | "debit",
        amount: txn.amount,
        description: txn.description,
        balanceAfter: runningBalance.toFixed(2),
        createdAt: txnDate,
      });
    }
    
    console.log("Transaction history added successfully!");
    console.log("\n=== Account Setup Complete ===");
    console.log("Email: " + email);
    console.log("Password: lowry123");
    console.log("Account Number: " + account.accountNumber);
    console.log("Current Balance: $" + balance);
    console.log("Admin Access: Yes");
    console.log("Transaction History: Last 30 days");
    console.log("==============================\n");
    
  } catch (error) {
    console.error("Error setting up user:", error);
    throw error;
  }
}

setupUser()
  .then(() => {
    console.log("Setup completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Setup failed:", error);
    process.exit(1);
  });
