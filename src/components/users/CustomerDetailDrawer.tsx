"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  LucideShoppingBag,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldAlert,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { usersApi } from "@/features/users/api";
import type { AccountStatus, CustomerUser } from "@/features/users/types";
import { formatBackendDate } from "@/lib/date-format";

type CustomerDetailDrawerProps = {
  customer: CustomerUser | null;
  onClose: () => void;
};

export function CustomerDetailDrawer({ customer, onClose }: CustomerDetailDrawerProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"overview" | "orders">("overview");
  const [ordersPage, setOrdersPage] = useState(1);
  const [statusReason, setStatusReason] = useState("");
  const [changingStatus, setChangingStatus] = useState<AccountStatus | null>(null);

  const userId = customer?.id ?? "";

  const detailsQuery = useQuery({
    queryKey: ["customer-details", userId],
    queryFn: () => usersApi.getCustomerDetails(userId),
    enabled: Boolean(userId),
  });

  const ordersQuery = useQuery({
    queryKey: ["customer-orders", userId, ordersPage],
    queryFn: () => usersApi.getCustomerOrders(userId, ordersPage, 10),
    enabled: Boolean(userId) && activeTab === "orders",
  });

  const statusMutation = useMutation({
    mutationFn: ({ status, reason }: { status: AccountStatus; reason?: string }) =>
      usersApi.changeUserStatus(userId, status, reason),
    onSuccess: async (_, vars) => {
      toast.success(`Account status updated to ${vars.status}.`);
      setChangingStatus(null);
      setStatusReason("");
      await queryClient.invalidateQueries({ queryKey: ["customer-details", userId] });
      await queryClient.invalidateQueries({ queryKey: ["customer-directory"] });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update user status.");
    },
  });

  if (!customer) return null;

  const profile = detailsQuery.data?.profile || customer;
  const totalDeliveries = detailsQuery.data?.totalDeliveries ?? 0;
  const totalComplaints = detailsQuery.data?.totalComplaints ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="flex h-full w-full max-w-2xl flex-col border-l border-[var(--border)] bg-[var(--surface)] shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0fdf4] font-semibold text-[#15803d]">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">{profile.name}</h2>
                <Badge>{profile.status}</Badge>
                {profile.hasSupportFlag ? (
                  <span className="flex items-center gap-1 rounded-full bg-[#fef2f2] px-2 py-0.5 text-xs font-medium text-[#b42318]">
                    <ShieldAlert className="h-3 w-3" /> Flagged
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">ID: {profile.id}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-[var(--muted-foreground)] hover:bg-[var(--surface-muted)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[var(--border)] px-6">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`border-b-2 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "overview"
                ? "border-[var(--primary)] text-[var(--primary)]"
                : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <User className="mr-2 inline-block h-4 w-4" />
            Customer Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`border-b-2 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "orders"
                ? "border-[var(--primary)] text-[var(--primary)]"
                : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <LucideShoppingBag className="mr-2 inline-block h-4 w-4" />
            Orders & Transactions ({totalDeliveries})
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" ? (
            <div className="space-y-6">
              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-center">
                  <p className="text-xs font-medium text-[var(--muted-foreground)]">Total Orders</p>
                  <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{totalDeliveries}</p>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-center">
                  <p className="text-xs font-medium text-[var(--muted-foreground)]">Complaints</p>
                  <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{totalComplaints}</p>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-center">
                  <p className="text-xs font-medium text-[var(--muted-foreground)]">Role</p>
                  <p className="mt-1 text-lg font-bold text-[var(--foreground)]">
                    {profile.roles.join(", ") || "Customer"}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="rounded-2xl border border-[var(--border)] p-4 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Contact Information
                </h3>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                    <Mail className="h-4 w-4" /> Email:
                  </div>
                  <div className="font-medium text-[var(--foreground)]">{profile.email}</div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                    <Phone className="h-4 w-4" /> Phone:
                  </div>
                  <div className="font-medium text-[var(--foreground)]">{profile.phoneNumber || "—"}</div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                    <Calendar className="h-4 w-4" /> Member Since:
                  </div>
                  <div className="font-medium text-[var(--foreground)]">{formatBackendDate(profile.createdOn)}</div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                    <Clock className="h-4 w-4" /> Last Active:
                  </div>
                  <div className="font-medium text-[var(--foreground)]">{formatBackendDate(profile.lastOnlineAt, "Never")}</div>
                </div>
              </div>

              {/* Verifications */}
              <div className="rounded-2xl border border-[var(--border)] p-4 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Security & Verifications
                </h3>
                <div className="flex items-center justify-between text-sm">
                  <span>Email Verification</span>
                  {detailsQuery.data?.emailConfirmed ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
                      <AlertTriangle className="h-4 w-4" /> Unverified
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Phone Verification</span>
                  {detailsQuery.data?.phoneNumberConfirmed ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
                      <AlertTriangle className="h-4 w-4" /> Unverified
                    </span>
                  )}
                </div>
              </div>

              {/* Account Status Control */}
              <div className="rounded-2xl border border-[var(--border)] p-4 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Account Status Actions
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {profile.status !== "Active" ? (
                    <Button
                      type="button"
                      variant="secondary"
                      className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      onClick={() => statusMutation.mutate({ status: "Active" })}
                    >
                      Reactivate Customer
                    </Button>
                  ) : null}
                  {profile.status !== "Suspended" ? (
                    <Button
                      type="button"
                      variant="secondary"
                      className="text-xs bg-amber-50 text-amber-700 hover:bg-amber-100"
                      onClick={() => setChangingStatus("Suspended")}
                    >
                      Suspend Account
                    </Button>
                  ) : null}
                  {profile.status !== "Restricted" ? (
                    <Button
                      type="button"
                      variant="secondary"
                      className="text-xs bg-red-50 text-red-700 hover:bg-red-100"
                      onClick={() => setChangingStatus("Restricted")}
                    >
                      Restrict Account
                    </Button>
                  ) : null}
                </div>

                {changingStatus ? (
                  <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3 space-y-3">
                    <p className="text-xs font-medium">Reason for setting account to {changingStatus}:</p>
                    <input
                      type="text"
                      placeholder="Specify reason..."
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs outline-none"
                      value={statusReason}
                      onChange={(e) => setStatusReason(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        className="text-xs h-7 px-2"
                        onClick={() => setChangingStatus(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        className="text-xs h-7 px-3"
                        onClick={() =>
                          statusMutation.mutate({ status: changingStatus, reason: statusReason })
                        }
                      >
                        Confirm Status Change
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            /* Orders / Transactions Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Orders & Deliveries History</h3>
                <span className="text-xs text-[var(--muted-foreground)]">
                  Total: {ordersQuery.data?.totalCount ?? totalDeliveries}
                </span>
              </div>

              {ordersQuery.isLoading ? (
                <div className="py-12 text-center text-sm text-[var(--muted-foreground)]">
                  Loading customer orders...
                </div>
              ) : ordersQuery.data?.items && ordersQuery.data.items.length > 0 ? (
                <div className="space-y-3">
                  {ordersQuery.data.items.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 transition-all hover:border-[var(--border-strong)]"
                    >
                      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-[var(--primary)]" />
                          <span className="font-semibold text-sm">{order.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge label={order.status} />
                          <span className="font-semibold text-sm">₦{order.price.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2 text-xs">
                        <div className="flex items-start gap-2 text-[var(--muted-foreground)]">
                          <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-[var(--foreground)]">Pickup:</strong> {order.pickupLocation}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-[var(--muted-foreground)]">
                          <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-[var(--foreground)]">Dropoff:</strong> {order.dropoffLocation}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-[var(--muted-foreground)]">
                          <span>Rider: <strong className="text-[var(--foreground)]">{order.riderName || "Unassigned"}</strong></span>
                          <span>{formatBackendDate(order.createdOn)}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  {ordersQuery.data.totalCount > 10 ? (
                    <div className="flex items-center justify-between pt-4">
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={ordersPage <= 1}
                        onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                        className="text-xs h-8 px-3"
                      >
                        Previous
                      </Button>
                      <span className="text-xs text-[var(--muted-foreground)]">
                        Page {ordersPage} of {Math.ceil(ordersQuery.data.totalCount / 10)}
                      </span>
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={ordersPage >= Math.ceil(ordersQuery.data.totalCount / 10)}
                        onClick={() => setOrdersPage((p) => p + 1)}
                        className="text-xs h-8 px-3"
                      >
                        Next
                      </Button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted-foreground)]">
                  No orders found for this customer.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
