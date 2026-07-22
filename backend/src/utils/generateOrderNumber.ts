import prisma from "../lib/prisma";

export async function generateOrderNumber(
  prefix: string,
  tenantId: string
): Promise<string> {
  const today = new Date();

  const date =
    today.getFullYear().toString() +
    String(today.getMonth() + 1).padStart(2, "0") +
    String(today.getDate()).padStart(2, "0");

  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const count =
    await prisma.restaurantOrder.count({
      where: {
        tenantId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

  const sequence = String(count + 1).padStart(4, "0");

  return `${prefix}-${date}-${sequence}`;
}