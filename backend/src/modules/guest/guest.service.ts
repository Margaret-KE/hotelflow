import prisma from "../../lib/prisma";
import ApiError from "../../utils/ApiError";

export async function getGuests(tenantId: string) {
  return prisma.guest.findMany({
    where: {
      tenantId,
      isActive: true,
    },
    orderBy: {
      firstName: "asc",
    },
  });
}

export async function getGuestById(
  tenantId: string,
  guestId: string
) {
  const guest = await prisma.guest.findFirst({
    where: {
      id: guestId,
      tenantId,
      isActive: true,
    },
  });

  if (!guest) {
    throw new ApiError(404, "Guest not found");
  }

  return guest;
}

export async function createGuest(
  tenantId: string,
  data: any
) {
  const existingGuest = await prisma.guest.findFirst({
    where: {
      tenantId,
      phone: data.phone,
      isActive: true,
    },
  });

  if (existingGuest) {
    throw new ApiError(
      409,
      "A guest with this phone number already exists."
    );
  }

  return prisma.guest.create({
    data: {
      tenantId,

      firstName: data.firstName,
      lastName: data.lastName,

      email: data.email || null,
      phone: data.phone,

      idType: data.idType,
      idNumber: data.idNumber,

      nationality: data.nationality,

      gender: data.gender,

      dateOfBirth: data.dateOfBirth
        ? new Date(data.dateOfBirth)
        : null,

      address: data.address,
      city: data.city,
      country: data.country,

      emergencyName: data.emergencyName,
      emergencyPhone: data.emergencyPhone,

      company: data.company,

      notes: data.notes,

      vip: data.vip ?? false,
      blacklisted: data.blacklisted ?? false,
    },
  });
}

export async function updateGuest(
  tenantId: string,
  guestId: string,
  data: any
) {
  await getGuestById(tenantId, guestId);

  return prisma.guest.update({
    where: {
      id: guestId,
    },
    data: {
      ...data,

      dateOfBirth: data.dateOfBirth
        ? new Date(data.dateOfBirth)
        : undefined,
    },
  });
}

export async function deleteGuest(
  tenantId: string,
  guestId: string
) {
  await getGuestById(tenantId, guestId);

  return prisma.guest.update({
    where: {
      id: guestId,
    },
    data: {
      isActive: false,
    },
  });
}