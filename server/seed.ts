import { createUser, createAccount, getUserByUsername } from "./storage";

async function seed() {
  try {
    console.log("Starting database seed...");

    // Create admin user
    console.log("Creating admin user...");
    const existingAdmin = await getUserByUsername("admin");
    if (!existingAdmin) {
      await createUser({
        username: "admin",
        password: "admin123",
        fullName: "System Administrator",
        email: "admin@bankingportal.com",
        isAdmin: true,
      });
      console.log("✓ Admin user created (username: admin, password: admin123)");
    } else {
      console.log("✓ Admin user already exists");
    }

    // Create Mark Lowry user
    console.log("Creating Mark Lowry user...");
    const existingUser = await getUserByUsername("marklowry");
    if (!existingUser) {
      const markLowry = await createUser({
        username: "marklowry",
        password: "lowry123",
        fullName: "Mark Lowry",
        email: "mark@mlowryvocalband.com",
        isAdmin: false,
      });
      console.log("✓ Mark Lowry user created (username: marklowry, password: lowry123)");

      // Create business account with $16 million
      await createAccount({
        userId: markLowry.id,
        businessName: "M. LOWRY VOCAL BAND",
        initialBalance: "16000000.00",
      });
      console.log("✓ Business account created with $16,000,000.00 balance");
    } else {
      console.log("✓ Mark Lowry user already exists");
    }

    console.log("\n=== SEED COMPLETED ===");
    console.log("\nLogin Credentials:");
    console.log("─────────────────────────────────");
    console.log("ADMIN:");
    console.log("  Username: admin");
    console.log("  Password: admin123");
    console.log("");
    console.log("MARK LOWRY:");
    console.log("  Username: marklowry");
    console.log("  Password: lowry123");
    console.log("  Business: M. LOWRY VOCAL BAND");
    console.log("  Balance: $16,000,000.00");
    console.log("─────────────────────────────────\n");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
