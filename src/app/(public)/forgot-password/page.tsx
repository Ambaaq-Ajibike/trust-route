import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Card } from "@/components/common/Card";

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-md p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Forgot password</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Request a reset link for your account.
        </p>
      </div>
      <ForgotPasswordForm />
    </Card>
  );
}
