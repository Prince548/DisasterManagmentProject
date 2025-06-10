import { z } from "zod";
import {
  idSchema,
  emailSchema,
  passwordSchema,
  nicSchema,
  mobileSchema,
  locationSchema,
} from "./schemas/commonSchema.js";
import { createValidationSchema } from "./validationMiddleware.js";

// Schema for user ID parameter
const userIdParamSchema = z.object({
  id: idSchema,
});

// Schema for city parameter
const cityParamSchema = z.object({
  city: z.string().min(1, { message: "City is required" }),
});

// Schema for user update
const userUpdateSchema = z.object({
  fname: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .optional(),
  lname: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .optional(),
  email: emailSchema.optional(),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" })
    .optional(),
  province: z.string().min(1, { message: "Province is required" }).optional(),
  district: z.string().min(1, { message: "District is required" }).optional(),
  city: z.string().min(1, { message: "City is required" }).optional(),
  nic: nicSchema.optional(),
  mobile: mobileSchema.optional(),
  avatar: z.string().optional(),
});

// Schema for password change
const passwordChangeSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    newPassword: passwordSchema,
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

// Validators for user controller endpoints
export const validateUserUpdate = createValidationSchema(
  userUpdateSchema,
  userIdParamSchema
);
export const validatePasswordChange = createValidationSchema(
  passwordChangeSchema,
  userIdParamSchema
);
export const validateUserId = createValidationSchema(null, userIdParamSchema);
export const validateCityParam = createValidationSchema(null, cityParamSchema);
