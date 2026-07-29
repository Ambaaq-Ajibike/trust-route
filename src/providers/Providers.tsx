"use client";

import { AuthProvider } from "@/providers/AuthProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { RealtimeProvider } from "@/providers/RealtimeProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/providers/ToastProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <RealtimeProvider>
          <AuthProvider>{children}</AuthProvider>
        </RealtimeProvider>
      </QueryProvider>
      <ToastProvider />
    </ThemeProvider>
  );
}
