"use client";

import { CheckCircle2, ExternalLink, FileText, LoaderCircle, ShieldCheck, UserRound, X } from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { RiderReviewAction, RiderReviewRecord } from "@/features/riders/types";
import { formatBackendDate } from "@/lib/date-format";

export function RiderDetailModal({
  rider,
  title,
  busy,
  busyAction,
  onClose,
  onAction,
}: {
  rider: RiderReviewRecord | null;
  title: string;
  busy?: boolean;
  busyAction?: RiderReviewAction;
  onClose: () => void;
  onAction: (action: RiderReviewAction) => void;
}) {
  if (!rider) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">{title}</div>
            <h2 className="mt-1 text-2xl font-semibold">{rider.name}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <StatusBadge label={rider.status} />
              <Badge className="border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)]">
                {rider.id}
              </Badge>
              <Badge className="border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)]">
                {rider.city}
              </Badge>
            </div>
          </div>
          <button
            type="button"
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-full text-[var(--muted-foreground)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
            onClick={onClose}
            aria-label="Close rider details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid max-h-[calc(92vh-180px)] gap-4 overflow-y-auto p-5 xl:grid-cols-[1fr_330px]">
          <div className="space-y-4">
            <Section title="Applicant information" icon={UserRound}>
              <InfoGrid
                items={[
                  ["Email", rider.email],
                  ["Phone", rider.phone],
                  ["Address", rider.address],
                  ["Submitted", formatBackendDate(rider.submittedAt)],
                  ["Supervisor", rider.assignedSupervisor],
                ]}
              />
            </Section>

            <Section title="Vehicle details" icon={ShieldCheck}>
              <InfoGrid
                items={[
                  ["Type", rider.vehicle.type],
                  ["Plate number", rider.vehicle.plateNumber],
                  ["Color", rider.vehicle.color],
                  ["Capacity", rider.vehicle.capacity],
                ]}
              />
            </Section>

            <Section title="Next of kin and relatives" icon={UserRound}>
              <InfoGrid
                items={[
                  ["Next of kin", rider.nextOfKin.name],
                  ["Relationship", rider.nextOfKin.relationship],
                  ["Next of kin phone", rider.nextOfKin.phone],
                  ["Relative 1", `${rider.relatives[0]?.name ?? "N/A"} (${rider.relatives[0]?.relationship ?? "N/A"})`],
                  ["Relative 1 phone", rider.relatives[0]?.phone ?? "N/A"],
                  ["Relative 2", `${rider.relatives[1]?.name ?? "N/A"} (${rider.relatives[1]?.relationship ?? "N/A"})`],
                  ["Relative 2 phone", rider.relatives[1]?.phone ?? "N/A"],
                ]}
              />
            </Section>
          </div>

          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="text-sm font-semibold">Documents</h3>
              <div className="mt-3 space-y-2">
                {rider.documents.map((document) => (
                  <a
                    key={document.type}
                    href={document.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[var(--border)] p-3 transition hover:bg-[var(--surface-muted)]"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <FileText className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{document.label}</span>
                        <span className="block truncate text-xs text-[var(--muted-foreground)]">{document.fileName}</span>
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      {document.verified ? (
                        <CheckCircle2 className="h-4 w-4 text-[#0f766e]" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
                      )}
                      <ExternalLink className="h-4 w-4 text-[var(--muted-foreground)]" />
                    </span>
                  </a>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-semibold">Verification checks</h3>
              <div className="mt-3 space-y-2">
                {rider.checks.map((check) => (
                  <div key={check.label} className="flex items-center justify-between gap-3 rounded-xl bg-[var(--surface-muted)] px-3 py-2">
                    <span className="text-sm">{check.label}</span>
                    <StatusBadge label={check.status} />
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-[var(--muted-foreground)]">{rider.notes}</p>
            </Card>

            {(rider.rating || rider.completedDeliveries !== undefined) && (
              <Card className="p-4">
                <h3 className="text-sm font-semibold">Rider performance</h3>
                <InfoGrid
                  items={[
                    ["Rating", rider.rating ?? "N/A"],
                    ["Completed", String(rider.completedDeliveries ?? 0)],
                    ["Open issues", String(rider.activeIssues ?? 0)],
                    ["Last online", formatBackendDate(rider.lastOnline, "N/A")],
                  ]}
                />
              </Card>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[var(--border)] p-5 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button type="button" variant="destructive" disabled={busy} onClick={() => onAction("reject")}>
            {busyAction === "reject" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {busyAction === "reject" ? "Rejecting..." : "Reject"}
          </Button>
          <Button type="button" disabled={busy} onClick={() => onAction("approve")}>
            {busyAction === "approve" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {busyAction === "approve" ? "Approving..." : "Approve"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--surface-muted)] text-[var(--color-accent)]">
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {children}
    </Card>
  );
}

function InfoGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-xl bg-[var(--surface-muted)] px-3 py-2">
          <dt className="text-xs font-medium text-[var(--muted-foreground)]">{label}</dt>
          <dd className="mt-1 text-sm font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
