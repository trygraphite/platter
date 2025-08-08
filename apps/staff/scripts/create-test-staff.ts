import db from "@platter/db/index";
import bcrypt from "bcryptjs";

async function createTestStaff() {
  try {
    // First, create a test restaurant if it doesn't exist
    const restaurant = await db.user.upsert({
      where: { email: "test-restaurant@example.com" },
      update: {},
      create: {
        name: "Test Restaurant",
        email: "test-restaurant@example.com",
        userType: "RESTAURANT",
        role: "RESTAURANT",
        hasCompletedOnboarding: true,
      },
    });

    // Hash the password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create test staff user
    const staff = await db.staff.upsert({
      where: { email: "staff@test.com" },
      update: {
        password: hashedPassword,
        isActive: true,
      },
      create: {
        name: "John Doe",
        email: "staff@test.com",
        password: hashedPassword,
        position: "Waiter",
        staffRole: "WAITER",
        restaurantId: restaurant.id,
        canManageOrders: true,
        canManageMenu: false,
        canManageTables: true,
        canViewReports: false,
        isActive: true,
      },
    });

    console.log("✅ Test staff user created successfully!");
    console.log("📧 Email:", staff.email);
    console.log("🔑 Password: password123");
    console.log("🏪 Restaurant ID:", staff.restaurantId);
    console.log("👤 Staff ID:", staff.id);

    // Create additional test staff with different roles
    const managerPassword = await bcrypt.hash("manager123", 10);
    const manager = await db.staff.upsert({
      where: { email: "manager@test.com" },
      update: {
        password: managerPassword,
        isActive: true,
      },
      create: {
        name: "Jane Manager",
        email: "manager@test.com",
        password: managerPassword,
        position: "Manager",
        staffRole: "MANAGER",
        restaurantId: restaurant.id,
        canManageOrders: true,
        canManageMenu: true,
        canManageTables: true,
        canViewReports: true,
        isActive: true,
      },
    });

    console.log("\n✅ Test manager created successfully!");
    console.log("📧 Email:", manager.email);
    console.log("🔑 Password: manager123");

    const kitchenPassword = await bcrypt.hash("kitchen123", 10);
    const kitchen = await db.staff.upsert({
      where: { email: "kitchen@test.com" },
      update: {
        password: kitchenPassword,
        isActive: true,
      },
      create: {
        name: "Chef Smith",
        email: "kitchen@test.com",
        password: kitchenPassword,
        position: "Head Chef",
        staffRole: "KITCHEN",
        restaurantId: restaurant.id,
        canManageOrders: true,
        canManageMenu: true,
        canManageTables: false,
        canViewReports: false,
        isActive: true,
      },
    });

    console.log("\n✅ Test kitchen staff created successfully!");
    console.log("📧 Email:", kitchen.email);
    console.log("🔑 Password: kitchen123");
  } catch (error) {
    console.error("❌ Error creating test staff:", error);
  } finally {
    await db.$disconnect();
  }
}

// Run the script
createTestStaff();
