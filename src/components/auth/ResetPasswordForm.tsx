"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { authApi } from "@/features/auth/api";
import { resetPasswordSchema } from "@/features/auth/schemas";
import type { ResetPasswordInput } from "@/features/auth/types";

export function ResetPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => {
        await authApi.resetPassword(values);
        setMessage("Password updated.");
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
      <Button className="w-full" type="submit">
        Reset password
      </Button>
    </form>
  );
}
