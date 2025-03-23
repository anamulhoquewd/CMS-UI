import { z } from "zod";

const loginFormSchema = z.object({
  email: z
    .string()
    .refine(
      (value) =>
        /^\d{11}$/.test(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      {
        message: "Must be a valid email or 11-digit phone number",
      }
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password cannot exceed 20 characters"),
});

const resetPasswordFormSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password cannot exceed 20 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password cannot exceed 20 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const forgotPasswordFormSchema = z.object({
  email: z.string().email(),
});

const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(8).max(20),
    newPassword: z.string().min(8).max(20),
    confirmPassword: z.string().min(8).max(20),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const updateUserBySelfSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  NID: z.string().optional(),
  role: z.string().optional(),
});

const customerRegistrationFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  phone: z.string().min(11, { message: "Please enter a valid phone number" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),
  defaultItem: z.enum(["lunch", "dinner", "lunch&dinner"], {
    required_error: "Please select a default item",
  }),
  defaultPrice: z.coerce
    .number()
    .positive({ message: "Price must be a positive number" }),
  defaultQuantity: z.coerce
    .number()
    .int()
    .positive({ message: "Quantity must be a positive integer" }),
  defaultOffDays: z.array(z.string()).optional(),
  paymentStatus: z.enum(["paid", "partially_paid", "pending"], {
    required_error: "Please select a payment status",
  }),
  paymentSystem: z.enum(["weekly", "monthly"], {
    required_error: "Please select a payment system",
  }),
  active: z.boolean().default(true),
});

export {
  loginFormSchema,
  forgotPasswordFormSchema,
  resetPasswordFormSchema,
  updateUserBySelfSchema,
  changePasswordFormSchema,
  customerRegistrationFormSchema,
};
