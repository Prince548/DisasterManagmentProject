import { z } from "zod";
import { idSchema } from "./schemas/commonSchema.js";
import { createValidationSchema } from "./validationMiddleware.js";

// Schema for incident ID parameter
const incidentIdParamSchema = z.object({
  id: idSchema,
});

// Schema for incident details
const incidentDetailSchema = z.object({
  photos: z.array(z.string().url({ message: "Invalid photo URL" })).optional(),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  latitude: z.number().or(
    z
      .string()
      .regex(/^-?\d+(\.\d+)?$/)
      .transform(Number)
  ),
  longitude: z.number().or(
    z
      .string()
      .regex(/^-?\d+(\.\d+)?$/)
      .transform(Number)
  ),
  dangerLevel: z.enum(["Low", "Medium", "High"]),
  // Add other fields specific to your incident details
});

// Schema for incident data
const incidentDataSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  location: z
    .string()
    .min(5, { message: "Location must be at least 5 characters" }),
  city: z.string().min(1, { message: "City is required" }),
  incidentType: z.enum(["Fire", "Flood", "Earthquake", "Landslide", "Other"]),
  initialReport: z
    .string()
    .min(10, { message: "Initial report must be at least 10 characters" }),
  // Add other incident-specific fields
});

// Schema for adding an incident
const addIncidentSchema = z.object({
  incidentData: incidentDataSchema,
  incidentDetail: incidentDetailSchema,
});

// Schema for updating incident status
const approveRejectSchema = z.object({
  id: idSchema,
});

// Validators for incident controller endpoints
export const validateAddIncident = createValidationSchema(addIncidentSchema);
export const validateIncidentId = createValidationSchema(
  null,
  incidentIdParamSchema
);
export const validateApproveReject = createValidationSchema(
  null,
  approveRejectSchema
);
