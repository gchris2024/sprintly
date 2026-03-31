import { z } from "zod";

// Common validation schemas
const isoDateStringSchema = z
  .string({ message: "Date is required and must be a string" })
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Invalid date format. Use an ISO 8601 date string",
  });

const usernameSchema = z
  .string({ message: "Username is required and must be a string" })
  .trim()
  .min(1, { message: "Username cannot be empty" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers, and underscores",
  });

const passwordSchema = z
  .string({ message: "Password is required and must be a string" })
  .min(6, { message: "Password must be at least 6 characters" });

const taskSchema = z
  .string({ message: "Task is required and must be a string" })
  .trim()
  .min(1, { message: "Task cannot be empty" });

const minutesSchema = z
  .number({ message: "Minutes must be a number" })
  .int({ message: "Minutes must be a whole number" })
  .min(0, { message: "Minutes must be 0 or greater" });

// Auth
export const registerSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

// Todos
export const todoIdParamSchema = z.object({
  id: z.coerce
    .number({ message: "Todo id must be a number" })
    .int({ message: "Todo id must be an integer" })
    .positive({ message: "Todo id must be positive" }),
});

export const getWeeklyTodosQuerySchema = z.object({
  weekStart: isoDateStringSchema,
});

export const createTodoSchema = z.object({
  task: taskSchema,
  date: isoDateStringSchema,
  minutes: minutesSchema,
});

export const updateTodoSchema = z
  .object({
    task: taskSchema.optional(),
    completed: z.boolean({ message: "Completed must be a boolean" }).optional(),
    date: isoDateStringSchema.optional(),
    minutes: minutesSchema.optional(),
  })
  .refine(
    (value) => Object.values(value).some((field) => field !== undefined),
    {
      message: "At least one field is required to update a todo",
    },
  );

// Reflections
export const getCurrentReflectionQuerySchema = z.object({
  weekStart: isoDateStringSchema,
});

export const updateReflectionSchema = z
  .object({
    weekStart: isoDateStringSchema,
    wins: z.string({ message: "wins must be a string" }).optional(),
    challenges: z.string({ message: "challenges must be a string" }).optional(),
    nextWeekFocus: z
      .string({ message: "nextWeekFocus must be a string" })
      .optional(),
  })
  .refine(
    (value) =>
      value.wins !== undefined ||
      value.challenges !== undefined ||
      value.nextWeekFocus !== undefined,
    {
      message:
        "At least one reflection field is required: wins, challenges, or nextWeekFocus",
      path: ["wins"],
    },
  );
