import prisma from "../lib/prisma.js";
import { catchAsync, NotFoundError } from "../validators/customErrors.js";

export const getEmails = catchAsync(async (req, res) => {
  const emails = await prisma.email.findMany({
    include: {
      sentBy: {
        select: {
          username: true,
        },
      },
    },
  });
  res.status(200).json(emails);
});

export const addEmail = catchAsync(async (req, res) => {
  const { title, message, userCount, city, incidentId } = req.body;
  const tokenAdminId = req.adminId;

  // Verify incident exists if an incidentId is provided
  if (incidentId) {
    const incident = await prisma.incident.findUnique({
      where: { id: incidentId },
    });

    if (!incident) {
      throw new NotFoundError("Incident", incidentId);
    }
  }

  const newEmail = await prisma.email.create({
    data: {
      title,
      message,
      userCount,
      city,
      incidentId,
      sentById: tokenAdminId,
    },
  });

  res.status(200).json(newEmail);
});
