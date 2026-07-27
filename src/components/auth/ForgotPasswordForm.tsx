"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { authApi } from "@/features/auth/api";
import { loginSchema } from "@/features/auth/schemas";
import type { LoginInput } from "@/features/auth/types";

export function ForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<Pick<LoginInput, "email">>({
    resolver: zodResolver(loginSchema.pick({ email: true })),
  });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async ({ email }) => {
        await authApi.requestPasswordReset(email);
        setMessage("Reset instructions have been queued.");
      })}
    >
      <div>
        <label className="mb-2 block text-sm font-medium">Email</label>
        <Input type="email" autoComplete="email" {...register("email")} />
      </div>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      <Button className="w-full" type="submit">
        Send reset link
      </Button>
    </form>
  );
}
