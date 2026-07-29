"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { authApi } from "@/features/auth/api";
import { loginSchema } from "@/features/auth/schemas";
import type { LoginInput } from "@/features/auth/types";

export function ForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Pick<LoginInput, "email">>({
    resolver: zodResolver(loginSchema.pick({ email: true })),
  });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async ({ email }) => {
        try {
          await authApi.requestPasswordReset(email);
          setMessage("Reset instructions have been queued.");
          toast.success("Reset instructions have been sent.");
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Unable to request a password reset.");
        }
      })}
    >
      <div>
        <label className="mb-2 block text-sm font-medium">Email</label>
        <Input type="email" autoComplete="email" {...register("email")} />
      </div>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
        {isSubmitting ? "Sending..." : "Send reset link"}
      </Button>
    </form>
  );
}
