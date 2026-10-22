import { z } from "zod";

export const emailSchema = z.string().trim().email("Enter a valid email address").max(254);

export const newsletterSchema = z.object({ email: emailSchema });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export const registerSchema = loginSchema
  .extend({
    name: z.string().trim().min(2, "Enter your name").max(80),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const checkoutSchema = z.object({
  email: emailSchema,
  firstName: z.string().trim().min(1, "Required").max(60),
  lastName: z.string().trim().min(1, "Required").max(60),
  address: z.string().trim().min(5, "Enter your street address").max(160),
  city: z.string().trim().min(1, "Required").max(80),
  postalCode: z.string().trim().min(3, "Enter a valid postal code").max(12),
  country: z.string().trim().min(2, "Required").max(80),
  delivery: z.enum(["standard", "express"]),
  cardName: z.string().trim().min(2, "Name on card required").max(80),
  cardNumber: z
    .string()
    .trim()
    .regex(/^[0-9 ]{12,23}$/, "Enter a valid card number"),
  cardExpiry: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\/[0-9]{2}$/, "Use MM/YY"),
  cardCvc: z.string().trim().regex(/^[0-9]{3,4}$/, "3–4 digits"),
});

export const searchQuerySchema = z.object({
  q: z.string().trim().min(1).max(120),
});
