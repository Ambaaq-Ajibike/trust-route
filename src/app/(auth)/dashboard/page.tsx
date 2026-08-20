import { redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { readStoredSession } from "@/lib/auth-session";

export default function AuthDashboardPage() {
  const session = readStoredSession();
  if (session?.user.role === "super_admin") {
    redirect(routes.adminDashboard);
  }
  redirect(routes.supervisorDashboard);
}
