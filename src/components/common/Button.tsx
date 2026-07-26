import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-[var(--color-accent)] text-white hover:opacity-95 focus-visible:ring-[var(--color-accent)]",
        variant === "secondary" &&
          "bg-[var(--surface-muted)] text-[var(--foreground)] hover:bg-[var(--surface-muted-strong)]",
        variant === "ghost" &&
          "bg-transparent text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10",
        variant === "destructive" &&
          "bg-[#b42318] text-white hover:opacity-95 focus-visible:ring-[#b42318]",
        className,
      )}
      {...props}
    />
  );
}
