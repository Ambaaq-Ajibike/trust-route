"use client";

import { LogOut, UserRound } from "lucide-react";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/providers/AuthProvider";

export function UserMenu() {
  const { session, signOut } = useAuth();

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <div className="text-sm font-medium text-[var(--foreground)]">
          {session?.user.fullName ?? "User"}
        </div>
        <div className="text-xs text-[var(--muted-foreground)]">
          {session?.user.email ?? "No active session"}
        </div>
      </div>
      <Button variant="ghost" aria-label="Profile">
        <UserRound className="h-4 w-4" />
      </Button>
      <Button variant="ghost" aria-label="Logout" onClick={signOut}>
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
