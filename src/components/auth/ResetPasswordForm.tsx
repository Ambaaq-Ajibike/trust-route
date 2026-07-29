"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { authApi } from "@/features/auth/api";
import { resetPasswordSchema } from "@/features/auth/schemas";
import type { ResetPasswordInput } from "@/features/auth/types";

export function ResetPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => {
        try {
          await authApi.resetPassword(values);
          setMessage("Password updated.");
          toast.success("Password reset successfully.");
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Unable to reset the password.");
        }
      })}
    >
      <div>
        <label className="mb-2 block text-sm font-medium">Email</label>
        <Input type="email" autoComplete="email" {...register("email")} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Reset code</label>
        <Input {...register("code")} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">New password</label>
        <Input type="password" autoComplete="new-password" {...register("password")} />
      </div>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
        {isSubmitting ? "Resetting..." : "Reset password"}
      </Button>
    </form>
  );
}
