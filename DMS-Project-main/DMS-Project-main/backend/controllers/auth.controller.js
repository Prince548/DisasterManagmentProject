import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import {
  catchAsync,
  AuthenticationError,
  ConflictError,
  AuthorizationError,
} from "../validators/customErrors.js";

export const registerUser = catchAsync(async (req, res) => {
  const {
    fname,
    lname,
    email,
    password,
    address,
    province,
    district,
    city,
    nic,
    mobile,
    uploadedAvatar,
  } = req.body;

  // Check if user with this email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email },
  });

  if (existingUser) {
    throw new ConflictError("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      fname,
      lname,
      email,
      password: hashedPassword,
      address,
      province,
      district,
      city,
      nic,
      mobile,
      avatar: uploadedAvatar,
    },
  });

  res.status(201).json({ message: "User registered successfully." });
});

export const signinUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) throw new AuthenticationError("Invalid credentials.");

  console.log(user);

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    throw new AuthenticationError("Check your password again.");

  const age = 1000 * 60 * 60 * 24 * 7;

  const { password: userPassword, ...userInfo } = user;

  const token = jwt.sign(
    {
      id: user.id,
      isAdmin: false,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: age }
  );

  res
    .cookie("token", token, {
      httpOnly: true,
      maxAge: age,
      // secure: true in production
    })
    .status(200)
    .json(userInfo);
});

export const logoutUser = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout successful." });
};

//Admin Side
export const registerAdmin = catchAsync(async (req, res) => {
  const tokenAdminId = req.adminId;

  const {
    fullName,
    username,
    password,
    email,
    nic,
    mobile,
    avatar,
    department,
    isMaster,
  } = req.body;

  // Check if admin with this username or email already exists
  const existingAdmin = await prisma.admin.findFirst({
    where: {
      OR: [{ username: username }, { email: email }],
    },
  });

  if (existingAdmin) {
    throw new ConflictError("Admin with this username or email already exists");
  }

  // Check if the requesting admin is a master admin
  const requestingAdmin = await prisma.admin.findUnique({
    where: { id: tokenAdminId },
    select: { isMaster: true },
  });

  if (!requestingAdmin.isMaster) {
    throw new AuthorizationError("You are not authorized to Register Admins.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin = await prisma.admin.create({
    data: {
      fullName,
      username,
      password: hashedPassword,
      email,
      nic,
      mobile,
      avatar,
      department,
      isMaster,
    },
  });

  res.status(201).json({ message: "Admin registered successfully." });
});

export const signinAdmin = catchAsync(async (req, res) => {
  const { username, password } = req.body;

  const admin = await prisma.admin.findUnique({
    where: { username: username },
  });

  if (!admin) throw new AuthenticationError("Invalid credentials.");

  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid)
    throw new AuthenticationError("Check your password again.");

  const age = 1000 * 60 * 60 * 24;

  const { password: adminPassword, ...adminInfo } = admin;

  const token = jwt.sign(
    {
      id: admin.id,
      isAdmin: true,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: age }
  );

  res
    .cookie("adminToken", token, {
      httpOnly: true,
      maxAge: age,
      // secure: true in production
    })
    .status(200)
    .json(adminInfo);
});

export const logoutAdmin = (req, res) => {
  res
    .clearCookie("adminToken")
    .status(200)
    .json({ message: "Admin Logout successful." });
};
