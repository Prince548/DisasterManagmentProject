import { PrismaClient } from "@prisma/client";

// Create Prisma client instance with logging
const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
  errorFormat: "pretty",
});

// Handle clean shutdown
process.on("SIGINT", async () => {
  console.log("Disconnecting from database...");
  await prisma.$disconnect();
  process.exit(0);
});

// Handle unexpected errors
process.on("uncaughtException", async (e) => {
  console.error("Uncaught exception:", e);
  await prisma.$disconnect();
  process.exit(1);
});

export default prisma;
