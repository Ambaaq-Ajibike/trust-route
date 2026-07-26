"use client";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/common/Button";
import { RoleBadge } from "./RoleBadge";
import { UserMenu } from "./UserMenu";

export function AppHeader({
  title,
  role,
  onMenuClick,
  isMenuOpen = false,
}: {
  title: string;
  role: string;
  onMenuClick?: () => void;
  isMenuOpen?: boolean;
}) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3 md:px-6">
      <div className="flex items-center gap-3">
        {onMenuClick ? (
          <Button
            variant="ghost"
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            onClick={onMenuClick}
            className="lg:hidden"
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        ) : null}
        <div>
          <div className="text-base font-semibold text-[var(--foreground)]">{title}</div>
          <RoleBadge role={role} />
        </div>
      </div>
      <UserMenu />
    </header>
  );
}
