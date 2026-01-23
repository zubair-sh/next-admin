import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL or DIRECT_URL environment variable is required",
  );
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  // Define permissions
  const permissions = [
    // User Management
    { action: "create", subject: "User", description: "Create new users" },
    { action: "read", subject: "User", description: "View user details" },
    { action: "read_all", subject: "User", description: "View all users list" },
    {
      action: "update",
      subject: "User",
      description: "Update user information",
    },
    { action: "delete", subject: "User", description: "Delete users" },

    // Role Management
    { action: "create", subject: "Role", description: "Create new roles" },
    { action: "read", subject: "Role", description: "View role details" },
    { action: "read_all", subject: "Role", description: "View all roles list" },
    {
      action: "update",
      subject: "Role",
      description: "Update role information",
    },
    { action: "delete", subject: "Role", description: "Delete roles" },

    // Permission Management
    {
      action: "create",
      subject: "Permission",
      description: "Create new permissions",
    },
    {
      action: "read",
      subject: "Permission",
      description: "View permission details",
    },
    {
      action: "read_all",
      subject: "Permission",
      description: "View all permissions list",
    },
    {
      action: "update",
      subject: "Permission",
      description: "Update permission information",
    },
    {
      action: "delete",
      subject: "Permission",
      description: "Delete permissions",
    },

    // Dashboard
    { action: "read", subject: "Dashboard", description: "Access dashboard" },
    { action: "read", subject: "Analytics", description: "View analytics" },

    // Settings
    { action: "read", subject: "Settings", description: "View settings" },
    { action: "update", subject: "Settings", description: "Update settings" },
  ];

  console.log("📝 Creating permissions...");
  const createdPermissions = await Promise.all(
    permissions.map((permission) =>
      prisma.permission.upsert({
        where: {
          action_subject: {
            action: permission.action,
            subject: permission.subject,
          },
        },
        update: {},
        create: permission,
      }),
    ),
  );
  console.log(`✅ Created ${createdPermissions.length} permissions`);

  // Define roles with their permissions
  const roles = [
    {
      name: "Super Admin",
      description: "Full system access with all permissions",
      isSystem: true,
      permissions: createdPermissions, // All permissions
    },
    {
      name: "Admin",
      description: "Administrative access with most permissions",
      isSystem: true,
      permissions: createdPermissions.filter(
        (p) =>
          !(
            (p.subject === "Role" && p.action === "delete") ||
            (p.subject === "Permission" &&
              ["create", "update", "delete"].includes(p.action))
          ),
      ),
    },
    {
      name: "User",
      description: "Basic user access",
      isSystem: true,
      permissions: createdPermissions.filter(
        (p) =>
          (p.subject === "Dashboard" && p.action === "read") ||
          (p.subject === "User" && p.action === "read"),
      ),
    },
  ];

  console.log("👥 Creating roles...");
  for (const role of roles) {
    const { permissions: rolePermissions, ...roleData } = role;

    const createdRole = await prisma.role.upsert({
      where: { name: role.name },
      update: {
        description: roleData.description,
        permissions: {
          set: rolePermissions.map((p) => ({ id: p.id })),
        },
      },
      create: {
        ...roleData,
        permissions: {
          connect: rolePermissions.map((p) => ({ id: p.id })),
        },
      },
    });

    console.log(
      `✅ Created role: ${createdRole.name} with ${rolePermissions.length} permissions`,
    );
  }

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
