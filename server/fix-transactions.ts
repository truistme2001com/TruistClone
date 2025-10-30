import { db } from "./storage";
import { transactions, accounts, users } from "@shared/schema";
import { eq } from "drizzle-orm";

async function fixTransactions() {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, "marklowry748@gmail.com"))
      .limit(1);
    
    if (!user) {
      console.error("User not found!");
      return;
    }

    const [account] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, user.id))
      .limit(1);
    
    if (!account) {
      console.error("Account not found!");
      return;
    }

    const finalBalance = 16000000.00;
    
    const transactionData = [
      { type: "credit", amount: 50000.00, description: "Wire transfer received from ABC Corp", daysAgo: 28, hour: 9, minute: 15 },
      { type: "debit", amount: 12500.00, description: "Payment to vendors", daysAgo: 27, hour: 14, minute: 30 },
      { type: "credit", amount: 75000.00, description: "Investment return", daysAgo: 25, hour: 11, minute: 45 },
      { type: "debit", amount: 8000.00, description: "Office supplies purchase", daysAgo: 23, hour: 16, minute: 20 },
      { type: "credit", amount: 100000.00, description: "Contract payment received", daysAgo: 21, hour: 10, minute: 5 },
      { type: "debit", amount: 25000.00, description: "Payroll processing", daysAgo: 20, hour: 8, minute: 0 },
      { type: "credit", amount: 60000.00, description: "Consulting fees received", daysAgo: 18, hour: 13, minute: 40 },
      { type: "debit", amount: 15000.00, description: "Equipment lease payment", daysAgo: 16, hour: 15, minute: 10 },
      { type: "credit", amount: 80000.00, description: "Sales revenue deposit", daysAgo: 14, hour: 9, minute: 30 },
      { type: "debit", amount: 20000.00, description: "Marketing campaign expenses", daysAgo: 12, hour: 17, minute: 55 },
      { type: "credit", amount: 45000.00, description: "Partnership distribution", daysAgo: 10, hour: 11, minute: 20 },
      { type: "debit", amount: 18000.00, description: "Professional services", daysAgo: 9, hour: 14, minute: 15 },
      { type: "credit", amount: 90000.00, description: "Quarterly bonus received", daysAgo: 7, hour: 10, minute: 45 },
      { type: "debit", amount: 30000.00, description: "Tax payment", daysAgo: 5, hour: 13, minute: 0 },
      { type: "credit", amount: 55000.00, description: "Rental income", daysAgo: 3, hour: 12, minute: 30 },
      { type: "debit", amount: 10000.00, description: "Insurance premium", daysAgo: 2, hour: 16, minute: 45 },
      { type: "credit", amount: 70000.00, description: "Investment dividend", daysAgo: 1, hour: 9, minute: 10 },
    ];

    let runningBalance = finalBalance;
    
    for (let i = transactionData.length - 1; i >= 0; i--) {
      const txn = transactionData[i];
      
      if (txn.type === "credit") {
        runningBalance -= txn.amount;
      } else {
        runningBalance += txn.amount;
      }
    }

    console.log("Starting balance (calculated):", runningBalance.toFixed(2));
    console.log("Final balance (target):", finalBalance.toFixed(2));
    console.log("\nCreating transactions with realistic times and correct balances...\n");

    for (const txn of transactionData) {
      const txnDate = new Date();
      txnDate.setDate(txnDate.getDate() - txn.daysAgo);
      txnDate.setHours(txn.hour, txn.minute, Math.floor(Math.random() * 60), 0);
      
      if (txn.type === "credit") {
        runningBalance += txn.amount;
      } else {
        runningBalance -= txn.amount;
      }
      
      await db.insert(transactions).values({
        accountId: account.id,
        type: txn.type as "credit" | "debit",
        amount: txn.amount.toFixed(2),
        description: txn.description,
        balanceAfter: runningBalance.toFixed(2),
        createdAt: txnDate,
      });
      
      console.log(
        `${txnDate.toLocaleDateString()} ${txnDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} - ` +
        `${txn.type === 'credit' ? '+' : '-'}$${txn.amount.toLocaleString()} - ` +
        `Balance: $${runningBalance.toLocaleString()}`
      );
    }

    await db
      .update(accounts)
      .set({ balance: finalBalance.toFixed(2) })
      .where(eq(accounts.id, account.id));

    console.log("\n✅ Transaction history fixed successfully!");
    console.log("Final balance:", finalBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
    
  } catch (error) {
    console.error("Error fixing transactions:", error);
    throw error;
  }
}

fixTransactions()
  .then(() => {
    console.log("\nSetup completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Setup failed:", error);
    process.exit(1);
  });
