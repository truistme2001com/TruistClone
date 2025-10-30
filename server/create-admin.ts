import { createUser, getUserByUsername } from "./storage";

async function createAdmin() {
  try {
    const username = "admin";
    const password = "admin123";
    
    let admin = await getUserByUsername(username);
    
    if (!admin) {
      console.log("Creating admin account...");
      admin = await createUser({
        username: username,
        password: password,
        fullName: "System Administrator",
        email: "admin@truist.com",
        isAdmin: true,
      });
      console.log("Admin account created successfully!");
    } else {
      console.log("Admin account already exists!");
    }
    
    console.log("\n=== Admin Account Details ===");
    console.log("Username: admin");
    console.log("Password: admin123");
    console.log("Admin Access: Yes");
    console.log("============================\n");
    
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
}

createAdmin()
  .then(() => {
    console.log("Setup completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Setup failed:", error);
    process.exit(1);
  });
