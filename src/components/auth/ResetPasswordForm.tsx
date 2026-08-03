"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { routes } from "@/config/routes";
import { authApi } from "@/features/auth/api";
import { resetPasswordSchema } from "@/features/auth/schemas";
import type { ResetPasswordInput } from "@/features/auth/types";

type ResetPasswordFormProps = {
  initialEmail?: string;
};

export function ResetPasswordForm({ initialEmail = "" }: ResetPasswordFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: initialEmail },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => {
        try {
          await authApi.resetPassword(values);
          toast.success("Password reset successfully.");
          router.replace(routes.login);
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
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            className="pr-11"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute inset-y-0 right-0 flex w-11 cursor-pointer items-center justify-center text-[var(--muted-foreground)]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
        {isSubmitting ? "Resetting..." : "Reset password"}
      </Button>
    </form>
  );
}
