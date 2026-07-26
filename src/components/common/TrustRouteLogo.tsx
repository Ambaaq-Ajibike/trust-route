import { Route } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  subtitle?: string;
  inverse?: boolean;
};

const sizes = {
  sm: {
    tile: "h-7 w-7 rounded-lg",
    icon: "h-3.5 w-3.5",
    marker: "h-1.5 w-1.5 rounded-[3px]",
    title: "text-base",
  },
  md: {
    tile: "h-10 w-10 rounded-xl",
    icon: "h-5 w-5",
    marker: "h-2.5 w-2.5 rounded",
    title: "text-lg",
  },
  lg: {
    tile: "h-12 w-12 rounded-[14px]",
    icon: "h-6 w-6",
    marker: "h-3 w-3 rounded",
    title: "text-xl",
  },
};

export function TrustRouteLogo({
  size = "md",
  showWordmark = true,
  subtitle,
  inverse = false,
}: Props) {
  const scale = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "relative grid place-items-center border",
          scale.tile,
          inverse
            ? "border-white/25 bg-white/12 text-white"
            : "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--color-accent)]",
        )}
      >
        <Route className={scale.icon} />
        <span
          className={cn(
            "absolute bottom-[12%] right-[12%] bg-[#f59e0b]",
            scale.marker,
          )}
        />
      </div>
      {showWordmark ? (
        <div className="leading-tight">
          <div
            className={cn(
              "font-extrabold tracking-normal",
              scale.title,
              inverse ? "text-white" : "text-[var(--foreground)]",
            )}
          >
            TrustRoute
          </div>
          {subtitle ? (
            <div
              className={cn(
                "mt-0.5 text-xs",
                inverse ? "text-white/72" : "text-[var(--muted-foreground)]",
              )}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
