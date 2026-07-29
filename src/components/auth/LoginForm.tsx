"use client";

import { useState } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { routes } from "@/config/routes";
import { authApi } from "@/features/auth/api";
import { loginSchema } from "@/features/auth/schemas";
import type { LoginInput } from "@/features/auth/types";
import { useAuth } from "@/providers/AuthProvider";

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      setError(null);
      const session = await authApi.login(values);
      signIn(session);
      toast.success("Welcome back.");
      router.replace(
        session.user.role === "supervisor"
          ? routes.supervisorDashboard
          : routes.adminDashboard,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed.";
      setError(message);
      toast.error(message);
    }
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <label className="mb-2 block text-sm font-medium">Email</label>
        <Input type="email" autoComplete="email" {...register("email")} />
        {errors.email ? (
          <p className="mt-1 text-xs text-[#b42318]">{errors.email.message}</p>
        ) : null}
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="block text-sm font-medium">Password</label>
          <Link
            href={routes.forgotPassword}
            className="text-sm font-semibold text-[var(--color-accent)] underline decoration-2 underline-offset-4 transition hover:opacity-75"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            className="pr-11"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[var(--muted-foreground)]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password ? (
          <p className="mt-1 text-xs text-[#b42318]">{errors.password.message}</p>
        ) : null}
      </div>
      {error ? <p className="text-sm text-[#b42318]">{error}</p> : null}
      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
        Sign in
      </Button>
    </form>
  );
}
