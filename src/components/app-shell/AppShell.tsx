"use client";

import { useState } from "react";
import type { Role } from "@/config/permissions";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";

export function AppShell({
  role,
  title,
  children,
}: {
  role: Role;
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <AppSidebar role={role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          title={title}
          role={role}
          onMenuClick={() => setOpen((value) => !value)}
          isMenuOpen={open}
        />
        <main className="flex-1 px-4 py-6 md:px-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            className="h-full w-72 bg-[var(--surface)] shadow-xl"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <AppSidebar role={role} mobile onClose={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
