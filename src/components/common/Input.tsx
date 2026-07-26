import { cn } from "@/lib/utils";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: Props) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--foreground)] shadow-sm outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-accent)_20%,transparent)]",
        className,
      )}
      {...props}
    />
  );
}
