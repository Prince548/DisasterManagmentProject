import { ZodError } from "zod";
import { AppError, ValidationError } from "./customErrors.js";

// Middleware factory that takes a schema and returns a middleware function
export const validate = (schema) => (req, res, next) => {
  try {
    // Determine which part of the request to validate
    const data = {};
    if (schema.body) data.body = schema.body.parse(req.body);
    if (schema.params) data.params = schema.params.parse(req.params);
    if (schema.query) data.query = schema.query.parse(req.query);

    // Replace the original request properties with the validated ones
    Object.assign(req, data);

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const validationErrors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      next(new ValidationError("Validation failed", validationErrors));
    } else {
      // If it's not a validation error, pass it to the next error handler
      next(error);
    }
  }
};

// Create validation for different parts of the request
export const createValidationSchema = (
  bodySchema,
  paramsSchema,
  querySchema
) => {
  const schema = {};
  if (bodySchema) schema.body = bodySchema;
  if (paramsSchema) schema.params = paramsSchema;
  if (querySchema) schema.query = querySchema;
  return schema;
};

// General error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let errors = err.errors || null;

  // Handle specific error types
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    errors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
  } else if (err.code === "P2002") {
    // Prisma unique constraint violation
    statusCode = 409;
    message = "Resource already exists";
  } else if (err.code === "P2025") {
    // Prisma record not found
    statusCode = 404;
    message = "Resource not found";
  }

  // Construct response
  const response = {
    status: statusCode >= 400 && statusCode < 500 ? "fail" : "error",
    message,
  };

  // Add errors array if present
  if (errors) response.errors = errors;

  // Add stack trace in development
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
