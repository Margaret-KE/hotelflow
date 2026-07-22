import "dotenv/config";

import { RoomTypeCategory } from "@prisma/client";
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
    { code: "reservations.cancel", name: "Cancel Reservation" },

    { code: "rooms.read", name: "View Rooms" },
    { code: "rooms.update", name: "Update Rooms" },

    { code: "guests.read", name: "View Guests" },
    { code: "guests.create", name: "Create Guest" },
    { code: "guests.update", name: "Update Guest" },
    { code: "guests.delete", name: "Delete Guest" },

    { code: "checkin.create", name: "Check In Guest" },
    { code: "checkout.create", name: "Check Out Guest" },

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
     password: hashedPassword,
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

const amenities = [
  "WiFi",
  "Air Conditioning",
  "Smart TV",
  "Mini Bar",
  "Coffee Maker",
  "Hot Shower",
  "Bathtub",
  "Balcony",
  "Desk",
  "Parking",
  "Breakfast Included",
  "Swimming Pool",
  "Conference Equipment",
  "Camp Fire",
  "Horse Riding Access",
];

for (const name of amenities) {
  await prisma.amenity.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

console.log(`✅ ${amenities.length} amenities created`);

const roomTypes = [
  {
    name: "Standard Room",
    category: RoomTypeCategory.ROOM,
    capacity: 2,
    basePrice: 6500,
  },
  {
    name: "Deluxe Room",
    category: RoomTypeCategory.ROOM,
    capacity: 2,
    basePrice: 9500,
  },
  {
    name: "Executive Suite",
    category: RoomTypeCategory.ROOM,
    capacity: 4,
    basePrice: 18000,
  },
  {
    name: "Family Cottage",
    category: RoomTypeCategory.COTTAGE,
    capacity: 6,
    basePrice: 22000,
  },
  {
    name: "Camping Tent",
    category: RoomTypeCategory.TENT,
    capacity: 2,
    basePrice: 3000,
  },
  {
    name: "Camping Site",
    category: RoomTypeCategory.CAMPING_SITE,
    capacity: 6,
    basePrice: 2500,
  },
  {
    name: "Conference Hall",
    category: RoomTypeCategory.CONFERENCE_HALL,
    capacity: 150,
    basePrice: 35000,
  },
];

for (const type of roomTypes) {
  await prisma.roomType.upsert({
    where: {
      tenantId_name: {
        tenantId: tenant.id,
        name: type.name,
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      ...type,
    },
  });
}

console.log(`✅ ${roomTypes.length} room types created`);

const standardRoom = await prisma.roomType.findFirst({
  where: {
    tenantId: tenant.id,
    name: "Standard Room",
  },
});

if (standardRoom) {
  for (let i = 1; i <= 20; i++) {
    await prisma.room.upsert({
      where: {
        tenantId_roomNumber: {
          tenantId: tenant.id,
          roomNumber: `10${i}`,
        },
      },
      update: {},
      create: {
        tenantId: tenant.id,
        roomTypeId: standardRoom.id,
        roomNumber: `10${i}`,
      },
    });
  }
}

console.log("✅ Sample rooms created");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });