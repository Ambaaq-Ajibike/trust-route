import { LoginForm } from "@/components/auth/LoginForm";
import { Card } from "@/components/common/Card";
import { TrustRouteLogo } from "@/components/common/TrustRouteLogo";

export default function LoginPage() {
  return (
    <Card className="w-full p-6">
      <div className="mb-6">
        <div className="mb-4 flex items-center gap-3 lg:hidden">
          <TrustRouteLogo />
        </div>
        <h1 className="text-2xl font-semibold tracking-normal">Sign in to the console</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Secure access for supervisor and system administrator workflows.
        </p>
      </div>
      <LoginForm />
    </Card>
  );
}
