import { z } from "zod";
import { idSchema } from "./schemas/commonSchema.js";
import { createValidationSchema } from "./validationMiddleware.js";

// Schema for adding a new email
const addEmailSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title cannot exceed 100 characters" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(5000, { message: "Message cannot exceed 5000 characters" }),
  userCount: z
    .number()
    .int()
    .positive({ message: "User count must be positive" }),
  city: z.string().min(1, { message: "City is required" }),
  incidentId: z
    .string()
    .uuid({ message: "Invalid incident ID format" })
    .optional(),
});

// Schema for sending emails to users in a specific city
const sendEmailToUsersSchema = z.object({
  subject: z
    .string()
    .min(3, { message: "Subject must be at least 3 characters" })
    .max(100, { message: "Subject cannot exceed 100 characters" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(5000, { message: "Message cannot exceed 5000 characters" }),
});

// Schema for city parameter
const cityParamSchema = z.object({
  city: z.string().min(1, { message: "City is required" }),
  id: idSchema,
});

// Validators for email controller endpoints
export const validateAddEmail = createValidationSchema(addEmailSchema);
export const validateSendEmail = createValidationSchema(
  sendEmailToUsersSchema,
  cityParamSchema
);
