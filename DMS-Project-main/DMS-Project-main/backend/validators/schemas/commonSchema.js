import { z } from "zod";

// Basic field definitions for reuse
export const emailSchema = z
  .string()
  .email({ message: "Invalid email format" });

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number" });

export const nicSchema = z.string().regex(/^[0-9]{9}[vVxX]$|^[0-9]{12}$/, {
  message: "NIC must be in the format of 9 digits followed by V/X or 12 digits",
});

export const mobileSchema = z.string().regex(/^[0-9]{10}$/, {
  message: "Mobile number must be 10 digits",
});

export const idSchema = z.string().uuid({ message: "Invalid ID format" });

// Common schema for location data
export const locationSchema = z.object({
  province: z.string().min(1, { message: "Province is required" }),
  district: z.string().min(1, { message: "District is required" }),
  city: z.string().min(1, { message: "City is required" }),
});

// Refinement for checking if fields match (e.g., for password confirmation)
export const checkMatch = (field, matchField, message) => {
  return z
    .object({
      [field]: z.string(),
      [matchField]: z.string(),
    })
    .refine((data) => data[field] === data[matchField], {
      message,
      path: [matchField],
    });
};
