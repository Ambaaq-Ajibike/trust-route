import { AuthenticatedShell } from "@/components/app-shell/AuthenticatedShell";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthenticatedShell>{children}</AuthenticatedShell>;
}
