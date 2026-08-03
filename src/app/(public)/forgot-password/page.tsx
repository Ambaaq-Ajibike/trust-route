import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Card } from "@/components/common/Card";
import { routes } from "@/config/routes";

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-md p-6">
      <Link
        href={routes.login}
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)] underline decoration-2 underline-offset-4 transition hover:opacity-75"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </Link>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Forgot password</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Request a reset code for your account.
        </p>
      </div>
      <ForgotPasswordForm />
    </Card>
  );
}
