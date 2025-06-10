import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import {
  catchAsync,
  NotFoundError,
  AuthorizationError,
  AuthenticationError,
} from "../validators/customErrors.js";

export const getUsers = catchAsync(async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
});

export const getUser = catchAsync(async (req, res) => {
  const id = req.params.id;
  const user = await prisma.user.findUnique({
    where: { id: id },
  });

  if (!user) {
    throw new NotFoundError("User", id);
  }

  res.status(200).json(user);
});

export const updateUsers = catchAsync(async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, avatar, ...inputs } = req.body;

  if (id !== tokenUserId) {
    throw new AuthorizationError("Not Authorized to update this user.");
  }

  let updatedPassword = null;

  if (password) {
    updatedPassword = await bcrypt.hash(password, 10);
  }

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id: id },
  });

  if (!existingUser) {
    throw new NotFoundError("User", id);
  }

  const updatedUser = await prisma.user.update({
    where: { id: id },
    data: {
      ...inputs,
      ...(updatedPassword && { password: updatedPassword }),
      ...(avatar && { avatar }),
    },
  });

  const { password: userPassword, ...rest } = updatedUser;

  res.status(200).json(rest);
});

export const changeUserPassword = catchAsync(async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { currentPassword, newPassword } = req.body;

  if (id !== tokenUserId) {
    throw new AuthorizationError(
      "Not Authorized to change this user's password."
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: id },
  });

  if (!user) {
    throw new NotFoundError("User", id);
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    throw new AuthenticationError("Current password is incorrect.");
  }

  // Hash new password
  const updatedPassword = await bcrypt.hash(newPassword, 10);

  // Update password in the database
  const updatedUser = await prisma.user.update({
    where: { id: id },
    data: { password: updatedPassword },
  });

  res.status(200).json({ message: "Password updated successfully." });
});

export const deleteUsers = catchAsync(async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    throw new AuthorizationError("Not Authorized to delete this user.");
  }

  const user = await prisma.user.findUnique({
    where: { id: id },
  });

  if (!user) {
    throw new NotFoundError("User", id);
  }

  await prisma.user.delete({
    where: { id: id },
  });

  res.status(200).json({ message: "User deleted." });
});

export const deleteUsersByAdmin = catchAsync(async (req, res) => {
  const id = req.params.id;

  const user = await prisma.user.findUnique({
    where: { id: id },
  });

  if (!user) {
    throw new NotFoundError("User", id);
  }

  // Delete incidents for this user with "Rejected" or "Pending" status
  await prisma.incident.deleteMany({
    where: {
      userId: id,
      isApproved: { in: ["rejected", "pending"] },
    },
  });

  // Delete the user after removing unapproved incidents
  await prisma.user.delete({
    where: { id: id },
  });

  res.status(200).json({ message: "User and related incidents deleted." });
});

export const countUsersByCity = catchAsync(async (req, res) => {
  const city = req.params.city.toLowerCase(); // Convert to lower case

  const userCount = await prisma.user.count({
    where: {
      // Adjusting the query for case-insensitive matching
      city: {
        equals: city,
        mode: "insensitive", // This makes the query case insensitive
      },
    },
  });

  res.status(200).json({ userCount });
});

// Set up transporter with your email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Ignore unauthorized certificate
  },
});

// Send email to users in the specified city
export const sendEmails = catchAsync(async (req, res) => {
  const { subject, message } = req.body;
  const { city } = req.params;
  const id = req.params.id;
  const tokenAdminId = req.adminId;

  if (id !== tokenAdminId) {
    throw new AuthorizationError("Not authorized to send emails.");
  }

  // Fetch all users in the specified city
  const users = await prisma.user.findMany({
    where: { city: city },
    select: { email: true },
  });

  if (users.length === 0) {
    throw new NotFoundError(`Users in city ${city}`);
  }

  // Extract emails
  const recipientEmails = users.map((user) => user.email);

  // Send email to all users
  const mailOptions = {
    from: "alert.warmhands@gmail.com",
    to: recipientEmails,
    subject: subject,
    text: message,
  };

  // Use a Promise to handle the callback-based sendMail
  const sendMailPromise = () => {
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  };

  const info = await sendMailPromise();
  res.status(200).json({ message: "Emails sent successfully", info });
});
