import { createUser, createAccount, getUserByUsername } from "./storage";

async function seed() {
  try {
    console.log("Starting database seed...");

    // Get credentials from environment variables (with fallbacks for development only)
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || generateSecurePassword();
    const testUsername = process.env.TEST_USERNAME || "testuser";
    const testPassword = process.env.TEST_PASSWORD || generateSecurePassword();

    // Create admin user
    console.log("Creating admin user...");
    const existingAdmin = await getUserByUsername(adminUsername);
    if (!existingAdmin) {
      await createUser({
        username: adminUsername,
        password: adminPassword,
        fullName: "System Administrator",
        email: "admin@bankingportal.com",
        isAdmin: true,
      });
      console.log(`✓ Admin user created (username: ${adminUsername})`);
    } else {
      console.log("✓ Admin user already exists");
    }

    // Create test user (only if explicitly enabled via environment variable)
    if (process.env.CREATE_TEST_USER === "true") {
      console.log("Creating test user...");
      const existingUser = await getUserByUsername(testUsername);
      if (!existingUser) {
        const testUser = await createUser({
          username: testUsername,
          password: testPassword,
          fullName: "Test User",
          email: "test@example.com",
          isAdmin: false,
        });
        console.log(`✓ Test user created (username: ${testUsername})`);

        // Create business account with initial balance
        const initialBalance = process.env.TEST_USER_BALANCE || "1000.00";
        await createAccount({
          userId: testUser.id,
          businessName: "Test Business",
          initialBalance,
        });
        console.log(`✓ Business account created with $${initialBalance} balance`);
      } else {
        console.log("✓ Test user already exists");
      }
    }

    console.log("\n=== SEED COMPLETED ===");
    console.log("\nIMPORTANT: Store your admin credentials securely!");
    if (!process.env.ADMIN_PASSWORD) {
      console.log(`\nGenerated admin password: ${adminPassword}`);
      console.log("⚠️  This password will not be shown again. Save it now!\n");
    }
    if (process.env.CREATE_TEST_USER === "true" && !process.env.TEST_PASSWORD) {
      console.log(`\nGenerated test user password: ${testPassword}`);
      console.log("⚠️  This password will not be shown again. Save it now!\n");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

function generateSecurePassword(): string {
  const length = 16;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

seed();
