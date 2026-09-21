import { PrismaClient } from "@prisma/client";
import { hallCapacity } from "../src/lib/seats";

const prisma = new PrismaClient();

async function main() {
  await prisma.event.updateMany({
    data: {
      maxPerStudent: 5,
      totalSeats: hallCapacity(),
    },
  });
}

main().finally(() => prisma.$disconnect());
