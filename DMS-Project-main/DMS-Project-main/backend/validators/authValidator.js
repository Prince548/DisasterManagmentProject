import { z } from "zod";
import {
  emailSchema,
  passwordSchema,
  nicSchema,
  mobileSchema,
  locationSchema,
} from "./schemas/commonSchema.js";
import { createValidationSchema } from "./validationMiddleware.js";

// User registration schema
const userRegisterSchema = z.object({
  fname: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lname: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: emailSchema,
  password: passwordSchema,
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),
  ...locationSchema.shape,
  nic: nicSchema,
  mobile: mobileSchema,
  uploadedAvatar: z.string().optional(),
});

// Admin registration schema (already defined in adminValidator.js)
// Here we just reference it for auth controller to use for admin registration

// User login schema
const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Password is required" }),
});

// Admin login schema
const adminLoginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// Exported validators
export const validateUserRegistration =
  createValidationSchema(userRegisterSchema);
export const validateUserLogin = createValidationSchema(userLoginSchema);
export const validateAdminLogin = createValidationSchema(adminLoginSchema);
