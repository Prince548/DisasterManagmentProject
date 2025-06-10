import prisma from "../lib/prisma.js";
import {
  catchAsync,
  NotFoundError,
  AuthorizationError,
} from "../validators/customErrors.js";

export const getAdmins = catchAsync(async (req, res) => {
  const admins = await prisma.admin.findMany({
    select: {
      id: true,
      fullName: true,
      username: true,
      email: true,
      avatar: true,
      department: true,
      nic: true,
      mobile: true,
      isMaster: true,
      createdAt: true,
    },
  });
  res.status(200).json(admins);
});

export const getAdmin = catchAsync(async (req, res) => {
  const id = req.adminId;

  const admin = await prisma.admin.findUnique({
    where: { id: id },
    select: {
      id: true,
      fullName: true,
      username: true,
      email: true,
      avatar: true,
      department: true,
      nic: true,
      mobile: true,
      isMaster: true,
      createdAt: true,
    },
  });

  if (!admin) {
    throw new NotFoundError("Admin", id);
  }

  res.status(200).json(admin);
});

export const deleteAdmin = catchAsync(async (req, res) => {
  const id = req.params.id; // ID of the admin to be deleted
  const tokenAdminId = req.adminId; // ID of the admin making the request

  if (id === tokenAdminId) {
    throw new AuthorizationError("You are not authorized to delete yourself.");
  }

  // Check if the requesting admin is a master admin
  const requestingAdmin = await prisma.admin.findUnique({
    where: { id: tokenAdminId },
    select: { isMaster: true },
  });

  if (!requestingAdmin.isMaster) {
    throw new AuthorizationError("You are not authorized to delete Admins.");
  }

  // Check if the admin to be deleted exists
  const adminToDelete = await prisma.admin.findUnique({
    where: { id: id },
  });

  if (!adminToDelete) {
    throw new NotFoundError("Admin", id);
  }

  // Proceed with deletion if master
  await prisma.admin.delete({
    where: { id: id },
  });

  res.status(200).json({ message: "Admin deleted successfully." });
});
