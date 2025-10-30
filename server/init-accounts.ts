import { db } from "./storage";
import { users, accounts, transactions } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

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
    
    if (existingAccounts.length === 0) {
      const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      await db.insert(accounts).values({
        userId: userId,
        businessName: "Mark Lowry Business Account",
        accountNumber: accountNumber,
        routingNumber: "061000104",
        balance: "16000000.00",
        accountType: "business",
        status: "active",
      });
      console.log("✓ Mark Lowry business account created");
    } else {
      console.log("✓ Mark Lowry business account exists");
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
