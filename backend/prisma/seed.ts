import "dotenv/config";

import bcrypt from "bcrypt";
import prisma from "../src/lib/prisma";

async function main() {
  console.log("🌱 Seeding HotelFlow...");

  // -----------------------------
  // Tenant
  // -----------------------------
  const tenant = await prisma.tenant.upsert({
    where: {
      slug: "greenwood",
    },
    update: {},
    create: {
      name: "Greenwood Hotel",
      slug: "greenwood",
      email: "info@greenwood.co.ke",
      phone: "+254700000000",
      country: "Kenya",
      city: "Nyeri",
      currency: "KES",
      timezone: "Africa/Nairobi",
    },
  });

  console.log("✅ Tenant created:", tenant.name);

  // -----------------------------
  // Permissions
  // -----------------------------
  const permissions = [
    { code: "dashboard.read", name: "View Dashboard" },

    { code: "reservations.read", name: "View Reservations" },
    { code: "reservations.create", name: "Create Reservation" },
    { code: "reservations.update", name: "Update Reservation" },
    { code: "reservations.delete", name: "Delete Reservation" },

    { code: "rooms.read", name: "View Rooms" },
    { code: "rooms.update", name: "Update Rooms" },

    { code: "guests.read", name: "View Guests" },
    { code: "guests.create", name: "Create Guest" },

    { code: "restaurant.read", name: "Restaurant POS" },
    { code: "restaurant.create", name: "Create Restaurant Order" },
    { code: "restaurant.update", name: "Update Restaurant Order" },

    { code: "kitchen.read", name: "Kitchen Display" },
    { code: "kitchen.print", name: "Print Kitchen Order" },

    { code: "bar.read", name: "Bar POS" },
    { code: "bar.create", name: "Create Bar Order" },

    { code: "conference.read", name: "Conference Management" },
    { code: "conference.create", name: "Conference Booking" },

    { code: "camping.read", name: "Camping Management" },

    { code: "activities.read", name: "Guest Activities" },
    { code: "activities.create", name: "Manage Guest Activities" },

    { code: "kids.read", name: "Kids Activities" },

    { code: "horse_riding.read", name: "Horse Riding" },

    { code: "housekeeping.read", name: "Housekeeping" },

    { code: "inventory.read", name: "Inventory" },
    { code: "inventory.update", name: "Update Inventory" },

    { code: "payments.read", name: "Payments" },
    { code: "payments.create", name: "Receive Payments" },

    { code: "reports.read", name: "View Reports" },
    { code: "reports.export", name: "Export Reports" },

    { code: "vat.read", name: "VAT Reports" },

    { code: "users.manage", name: "Manage Users" },
    { code: "roles.manage", name: "Manage Roles" },

    { code: "settings.manage", name: "System Settings" },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        code: permission.code,
      },
      update: {
        name: permission.name,
      },
      create: permission,
    });
  }

  console.log(`✅ ${permissions.length} permissions created`);

  const adminRole = await prisma.role.upsert({
  where: {
    tenantId_code: {
      tenantId: tenant.id,
      code: "ADMIN",
    },
  },
  update: {
    name: "Administrator",
    description: "System Administrator",
  },
  create: {
    tenantId: tenant.id,
    code: "ADMIN",
    name: "Administrator",
    description: "System Administrator",
    isSystem: true,
  },
});

console.log("✅ Administrator role created");

const allPermissions = await prisma.permission.findMany();

for (const permission of allPermissions) {
  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    },
    update: {},
    create: {
      roleId: adminRole.id,
      permissionId: permission.id,
    },
  });
}

console.log("✅ Administrator permissions assigned");

const hashedPassword = await bcrypt.hash("Admin@123", 12);

await prisma.user.upsert({
  where: {
    tenantId_email: {
      tenantId: tenant.id,
      email: "admin@greenwood.co.ke",
    },
  },
  update: {
    roleId: adminRole.id,
    isActive: true,
  },
  create: {
    tenantId: tenant.id,
    roleId: adminRole.id,
    firstName: "Margaret",
    lastName: "Administrator",
    email: "admin@greenwood.co.ke",
    password: hashedPassword,
    isActive: true,
  },
});

console.log("✅ Administrator account created");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });