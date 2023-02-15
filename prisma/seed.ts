import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function seed() {
  // clear all data
  await db.$transaction([
    db.case.deleteMany(),
    db.message.deleteMany(),
    db.conversation.deleteMany(),
    db.user.deleteMany(),
  ]);

  await db.user.create({
    data: { id: "gpt" },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
