import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string({ required_error: "First name is required" })
    .min(2, "First name must be at least 2 characters")
    .trim(),
  lastName: z
    .string({ required_error: "Last name is required" })
    .min(2, "Last name must be at least 2 characters")
    .trim(),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  password: z.string({ required_error: "Password is required" }).min(1),
});
