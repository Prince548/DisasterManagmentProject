import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  try {
    // Create master admin if it doesn't exist
    const adminExists = await prisma.admin.findFirst({
      where: {
        isMaster: true,
      },
    });

    console.log(adminExists);

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      const admin = await prisma.admin.create({
        data: {
          fullName: "System Administrator",
          username: "admin",
          email: "admin@warmhands.com",
          password: hashedPassword,
          department: "IT",
          nic: "ADMIN1234",
          mobile: "1234567890",
          isMaster: true,
        },
      });

      console.log(`Created master admin: ${admin.username}`);
    } else {
      console.log("Master admin already exists, skipping creation");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
