import { z } from "zod";
import {
  idSchema,
  emailSchema,
  passwordSchema,
  nicSchema,
  mobileSchema,
} from "./schemas/commonSchema.js";
import { createValidationSchema } from "./validationMiddleware.js";

// Schema for admin registration
const adminCreateSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  password: passwordSchema,
  email: emailSchema,
  nic: nicSchema,
  mobile: mobileSchema,
  department: z.string().min(1, { message: "Department is required" }),
  avatar: z.string().optional(),
  isMaster: z.boolean().default(false),
});

// Schema for admin updates (all fields optional)
const adminUpdateSchema = adminCreateSchema.partial().omit({ password: true });

// Schema for getting admin by ID
const adminIdParamSchema = z.object({
  id: idSchema,
});

// Validators for admin controller endpoints
export const validateAdminCreation = createValidationSchema(adminCreateSchema);
export const validateAdminUpdate = createValidationSchema(adminUpdateSchema);
export const validateAdminIdParam = createValidationSchema(
  null,
  adminIdParamSchema
);

// Optional: Combine schemas for different endpoints
export const validateDeleteAdmin = createValidationSchema(
  null,
  adminIdParamSchema
);
