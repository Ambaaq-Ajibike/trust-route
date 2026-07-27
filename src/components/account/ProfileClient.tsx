"use client";

import { KeyRound, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/common/Badge";
import { Card } from "@/components/common/Card";
import { PageHeader } from "@/components/common/PageHeader";
import { TrustRouteLogo } from "@/components/common/TrustRouteLogo";
import { ChangePasswordModal } from "@/components/account/ChangePasswordModal";
import { useAuth } from "@/providers/AuthProvider";

export function ProfileClient() {
  const { session } = useAuth();
  const user = session?.user;
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title="Profile"
          subtitle="Manage your web dashboard identity, role, permissions, and account security."
          role={user?.role}
        />

        <Card className="p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[var(--surface-muted)] text-xl font-semibold text-[var(--color-accent)]">
                {user?.fullName
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2) ?? "TR"}
              </div>
              <div>
                <TrustRouteLogo size="sm" />
                <h2 className="mt-3 text-2xl font-semibold">{user?.fullName ?? "Signed-in user"}</h2>
                <p className="text-sm text-[var(--muted-foreground)]">{user?.email ?? "No email found"}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--surface-muted)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--surface-muted-strong)] md:self-end"
            >
              <KeyRound className="h-4 w-4" />
              Change password
            </button>
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <Card className="p-5">
            <h3 className="text-lg font-semibold">Account details</h3>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <ProfileField icon={UserRound} label="Full name" value={user?.fullName ?? "N/A"} />
              <ProfileField icon={Mail} label="Email address" value={user?.email ?? "N/A"} />
              <ProfileField icon={ShieldCheck} label="Role" value={user?.role ?? "N/A"} />
              <ProfileField icon={KeyRound} label="Session" value={session ? "Active" : "Not available"} />
            </dl>
          </Card>

          <Card className="p-5">
            <h3 className="text-lg font-semibold">Permissions</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {(user?.permissions ?? []).map((permission) => (
                <Badge key={permission} className="border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)]">
                  {permission}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <ChangePasswordModal open={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </>
  );
}

function ProfileField({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-[var(--surface-muted)] p-4">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--surface)] text-[var(--color-accent)]">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <dt className="text-xs font-medium text-[var(--muted-foreground)]">{label}</dt>
        <dd className="mt-1 text-sm font-semibold">{value}</dd>
      </div>
    </div>
  );
}
