import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Card } from "@/components/common/Card";

export default function ResetPasswordPage() {
  return (
    <Card className="w-full max-w-md p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Reset password</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Enter the code sent to your email and choose a new password.
        </p>
      </div>
      <ResetPasswordForm />
    </Card>
  );
}
