import * as z from "zod";

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is Required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is Required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is Required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const BuySchema = z.object({
  amount: z.number().positive({
    message: "Amount must be a positive number",
  }).min(10, {
    message: "Minimum purchase amount is $10",
  }),
  valueToken: z.number().positive({
    message: "Token value must be a positive number",
  }),
  paymentMethod: z.enum(["USDT.BEP20", "USDT.TRC20", "BNB"], {
    message: "Invalid payment method",
  }),
  email: z.string().email({
    message: "Valid email is required",
  }).optional(),
});
