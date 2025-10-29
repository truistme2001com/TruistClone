import { db } from "./storage";
import { transactions, accounts } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seedTransactions() {
  try {
    console.log("Starting transaction history seed...");

    // Get Mark's account
    const [account] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.accountNumber, "17699652287693"))
      .limit(1);

    if (!account) {
      console.error("Account not found!");
      process.exit(1);
    }

    console.log(`Found account: ${account.businessName} (${account.accountNumber})`);
    console.log(`Current balance: $${account.balance}`);

    // Clear existing transactions
    await db.delete(transactions).where(eq(transactions.accountId, account.id));
    console.log("Cleared existing transactions");

    const targetBalance = 16000000.00;
    
    // Define transaction history with specific dates over 2+ months
    const transactionHistory: Array<{
      date: Date;
      type: "credit" | "debit";
      amount: number;
      description: string;
      transferMethod?: string;
      beneficiaryName?: string;
      beneficiaryAccount?: string;
      beneficiaryBank?: string;
      routingNumber?: string;
      swiftCode?: string;
      beneficiaryAddress?: string;
      referenceNumber?: string;
    }> = [
      // September 2025 - Initial deposits and early transactions
      { date: new Date("2025-09-01T09:23:15"), type: "credit", amount: 5000000.00, description: "Initial capital investment deposit", transferMethod: "domestic_wire", beneficiaryName: "Capital Ventures LLC", beneficiaryBank: "Chase Bank", routingNumber: "021000021" },
      { date: new Date("2025-09-01T14:45:30"), type: "credit", amount: 3000000.00, description: "Series A funding - Wire transfer", transferMethod: "domestic_wire", beneficiaryName: "Venture Capital Partners", beneficiaryBank: "Bank of America", routingNumber: "026009593" },
      { date: new Date("2025-09-03T10:12:45"), type: "credit", amount: 2500000.00, description: "Business loan proceeds", transferMethod: "ach" },
      { date: new Date("2025-09-05T16:34:20"), type: "debit", amount: 125000.00, description: "Office equipment purchase", transferMethod: "domestic_wire", beneficiaryName: "Office Solutions Inc", beneficiaryAccount: "9876543210", beneficiaryBank: "Wells Fargo", routingNumber: "121000248", beneficiaryAddress: "123 Business Ave, NY 10001" },
      { date: new Date("2025-09-08T11:20:10"), type: "debit", amount: 75000.00, description: "Legal fees - Corporate setup" },
      { date: new Date("2025-09-10T09:45:00"), type: "credit", amount: 450000.00, description: "Client payment - Project Alpha" },
      { date: new Date("2025-09-12T14:30:25"), type: "debit", amount: 200000.00, description: "Payroll - September Week 2" },
      { date: new Date("2025-09-15T08:15:40"), type: "credit", amount: 850000.00, description: "Contract revenue - Q3" },
      { date: new Date("2025-09-17T13:22:55"), type: "debit", amount: 50000.00, description: "Marketing campaign expenses" },
      { date: new Date("2025-09-19T10:05:30"), type: "debit", amount: 180000.00, description: "IT infrastructure upgrade" },
      { date: new Date("2025-09-22T15:40:15"), type: "credit", amount: 625000.00, description: "Invoice payment - Enterprise client" },
      { date: new Date("2025-09-24T09:30:00"), type: "debit", amount: 95000.00, description: "Insurance premiums - Annual" },
      { date: new Date("2025-09-26T11:55:45"), type: "debit", amount: 200000.00, description: "Payroll - September Week 4" },
      { date: new Date("2025-09-28T14:18:20"), type: "credit", amount: 1200000.00, description: "Strategic partnership payment", transferMethod: "domestic_wire", beneficiaryName: "Tech Innovations Corp", beneficiaryBank: "Citibank", routingNumber: "021000089" },
      
      // October 2025 - Business operations
      { date: new Date("2025-10-01T10:25:30"), type: "credit", amount: 750000.00, description: "Monthly recurring revenue - October" },
      { date: new Date("2025-10-03T13:45:15"), type: "debit", amount: 300000.00, description: "Real estate lease - Q4 prepayment" },
      { date: new Date("2025-10-05T09:12:40"), type: "credit", amount: 420000.00, description: "Consulting services revenue" },
      { date: new Date("2025-10-07T15:30:25"), type: "debit", amount: 150000.00, description: "Software licenses - Annual renewal" },
      { date: new Date("2025-10-10T11:20:10"), type: "debit", amount: 200000.00, description: "Payroll - October Week 2" },
      { date: new Date("2025-10-12T14:05:55"), type: "credit", amount: 580000.00, description: "Product sales - Enterprise tier" },
      { date: new Date("2025-10-14T10:40:30"), type: "debit", amount: 85000.00, description: "Professional services - Accounting" },
      { date: new Date("2025-10-16T16:15:45"), type: "credit", amount: 1100000.00, description: "Investment return - Q3 dividends", transferMethod: "ach" },
      { date: new Date("2025-10-18T09:50:20"), type: "debit", amount: 125000.00, description: "Travel and entertainment - Executive team" },
      { date: new Date("2025-10-20T13:25:35"), type: "credit", amount: 390000.00, description: "Licensing fees - Intellectual property" },
      { date: new Date("2025-10-22T11:10:50"), type: "debit", amount: 65000.00, description: "Utilities and facilities - October" },
      { date: new Date("2025-10-24T14:35:15"), type: "debit", amount: 200000.00, description: "Payroll - October Week 4" },
      { date: new Date("2025-10-26T10:20:40"), type: "credit", amount: 950000.00, description: "Large contract milestone payment" },
      { date: new Date("2025-10-28T15:45:25"), type: "debit", amount: 110000.00, description: "Research and development costs" },
      { date: new Date("2025-10-29T09:30:50"), type: "credit", amount: 680000.00, description: "International wire - Export sales", transferMethod: "international_wire", beneficiaryName: "Global Trading Ltd", beneficiaryAccount: "GB29NWBK60161331926819", beneficiaryBank: "HSBC London", swiftCode: "HSBCGB2L", beneficiaryAddress: "1 Canary Wharf, London E14 5HQ, UK" },
      
      // Late October/Early November - Additional transactions
      { date: new Date("2025-10-30T11:15:30"), type: "credit", amount: 520000.00, description: "Subscription revenue - Annual contracts" },
      { date: new Date("2025-10-31T16:40:15"), type: "debit", amount: 75000.00, description: "Office supplies and equipment" },
      { date: new Date("2025-11-02T10:05:45"), type: "credit", amount: 1500000.00, description: "Additional investor capital", transferMethod: "domestic_wire", beneficiaryName: "Growth Equity Fund", beneficiaryBank: "JPMorgan Chase", routingNumber: "021000021" },
      { date: new Date("2025-11-04T14:25:20"), type: "debit", amount: 240000.00, description: "Vendor payments - Bulk procurement" },
      { date: new Date("2025-11-06T09:50:35"), type: "credit", amount: 445000.00, description: "Service fees - November" },
      { date: new Date("2025-11-08T13:15:50"), type: "debit", amount: 95000.00, description: "Employee benefits - Health insurance" },
      { date: new Date("2025-11-10T11:30:25"), type: "debit", amount: 200000.00, description: "Payroll - November Week 2" },
      { date: new Date("2025-11-12T15:45:40"), type: "credit", amount: 725000.00, description: "Client payment - Project Beta completion" },
      { date: new Date("2025-11-14T10:20:15"), type: "debit", amount: 135000.00, description: "Marketing and advertising - Q4 campaign" },
      { date: new Date("2025-11-16T14:35:30"), type: "credit", amount: 890000.00, description: "Revenue share - Partnership program" },
      { date: new Date("2025-11-18T09:10:45"), type: "debit", amount: 58000.00, description: "Professional development and training" },
      { date: new Date("2025-11-20T16:25:20"), type: "credit", amount: 615000.00, description: "Invoice collections - Outstanding receivables" },
      { date: new Date("2025-11-22T11:40:35"), type: "debit", amount: 185000.00, description: "Technology infrastructure maintenance" },
      { date: new Date("2025-11-24T13:55:50"), type: "debit", amount: 200000.00, description: "Payroll - November Week 4" },
      { date: new Date("2025-11-26T10:15:25"), type: "credit", amount: 1350000.00, description: "Year-end bonus revenue recognition" },
      { date: new Date("2025-11-27T14:30:40"), type: "debit", amount: 425000.00, description: "Strategic acquisition - Asset purchase", transferMethod: "domestic_wire", beneficiaryName: "Tech Startup Solutions", beneficiaryAccount: "5544332211", beneficiaryBank: "US Bank", routingNumber: "091000022", beneficiaryAddress: "789 Innovation Dr, CA 94043" },
    ];

    // Calculate what the balance should be
    let runningBalance = 0;
    const calculatedTransactions = transactionHistory.map(tx => {
      if (tx.type === "credit") {
        runningBalance += tx.amount;
      } else {
        runningBalance -= tx.amount;
      }
      return { ...tx, balanceAfter: runningBalance };
    });

    // Check if we need to adjust to hit exactly $16M
    const difference = targetBalance - runningBalance;
    
    if (Math.abs(difference) > 0.01) {
      console.log(`Adjusting balance by $${difference.toFixed(2)} to reach target`);
      
      // Add a final adjustment transaction
      const adjustmentDate = new Date("2025-11-28T16:45:30");
      if (difference > 0) {
        calculatedTransactions.push({
          date: adjustmentDate,
          type: "credit",
          amount: difference,
          description: "Final quarter revenue adjustment",
          balanceAfter: targetBalance
        });
      } else {
        calculatedTransactions.push({
          date: adjustmentDate,
          type: "debit",
          amount: Math.abs(difference),
          description: "End of month reconciliation adjustment",
          balanceAfter: targetBalance
        });
      }
    }

    // Insert all transactions
    console.log(`\nInserting ${calculatedTransactions.length} transactions...`);
    
    for (const tx of calculatedTransactions) {
      await db.insert(transactions).values({
        accountId: account.id,
        type: tx.type,
        amount: tx.amount.toFixed(2),
        description: tx.description,
        balanceAfter: tx.balanceAfter.toFixed(2),
        transferMethod: tx.transferMethod || null,
        beneficiaryName: tx.beneficiaryName || null,
        beneficiaryAccount: tx.beneficiaryAccount || null,
        beneficiaryBank: tx.beneficiaryBank || null,
        routingNumber: tx.routingNumber || null,
        swiftCode: tx.swiftCode || null,
        beneficiaryAddress: tx.beneficiaryAddress || null,
        referenceNumber: tx.referenceNumber ? tx.referenceNumber : (tx.transferMethod ? `REF${Date.now()}${Math.floor(Math.random() * 10000)}` : null),
        createdAt: tx.date,
      });
    }

    const finalBalance = calculatedTransactions[calculatedTransactions.length - 1].balanceAfter;
    console.log(`\n✓ Transaction history created`);
    console.log(`✓ Total transactions: ${calculatedTransactions.length}`);
    console.log(`✓ Final balance: $${finalBalance.toFixed(2)}`);
    console.log(`✓ Target balance: $${targetBalance.toFixed(2)}`);
    console.log(`✓ Match: ${Math.abs(finalBalance - targetBalance) < 0.01 ? 'YES ✓' : 'NO ✗'}`);

    // Calculate totals
    const totalCredits = calculatedTransactions
      .filter(tx => tx.type === "credit")
      .reduce((sum, tx) => sum + tx.amount, 0);
    const totalDebits = calculatedTransactions
      .filter(tx => tx.type === "debit")
      .reduce((sum, tx) => sum + tx.amount, 0);

    console.log(`\n=== TRANSACTION SUMMARY ===`);
    console.log(`Total Credits: $${totalCredits.toFixed(2)}`);
    console.log(`Total Debits: $${totalDebits.toFixed(2)}`);
    console.log(`Net Balance: $${(totalCredits - totalDebits).toFixed(2)}`);
    console.log(`\nDate Range: Sep 1, 2025 - Nov 28, 2025`);
    console.log(`Duration: ~3 months of transaction history`);

  } catch (error) {
    console.error("Error seeding transactions:", error);
    process.exit(1);
  }
}

seedTransactions();
