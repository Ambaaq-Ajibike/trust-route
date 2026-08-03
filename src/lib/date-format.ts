const backendDateFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatBackendDate(value: string | null | undefined, fallback = "—"): string {
  if (!value?.trim()) return fallback;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : backendDateFormatter.format(date);
}