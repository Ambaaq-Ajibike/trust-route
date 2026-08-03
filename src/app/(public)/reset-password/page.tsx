import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Card } from "@/components/common/Card";

type ResetPasswordPageProps = {
  searchParams: Promise<{ email?: string | string[] }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { email } = await searchParams;
  const initialEmail = typeof email === "string" ? email : "";

  return (
    <Card className="w-full max-w-md p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Reset password</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Enter the code sent to your email and choose a new password.
        </p>
      </div>
      <ResetPasswordForm initialEmail={initialEmail} />
    </Card>
  );
}
