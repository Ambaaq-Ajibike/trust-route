import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  code: z.string().min(4, "Enter the reset code."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, "Current password must be at least 8 characters."),
    newPassword: z.string().min(8, "New password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm your new password."),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((value) => value.currentPassword !== value.newPassword, {
    message: "New password must be different from current password.",
    path: ["newPassword"],
  });
