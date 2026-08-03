"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye, EyeOff, LoaderCircle, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { PageHeader } from "@/components/common/PageHeader";
import { formatBackendDate } from "@/lib/date-format";
import {
  PaginatedDataTable,
  type TableColumn,
} from "@/components/common/PaginatedDataTable";
import {
  adminHttpApi,
  type AdminRole,
  type AdminRoleFilter,
  type AdminUser,
} from "@/features/admin/http-api";

const columns: TableColumn<AdminUser>[] = [
  {
    key: "name",
    label: "Name",
    render: (row) => (
      <div>
        <p className="font-medium">{[row.firstName, row.lastName].filter(Boolean).join(" ")}</p>
        <p className="text-xs text-[var(--muted-foreground)]">{row.email}</p>
      </div>
    ),
  },
  { key: "phone", label: "Phone", render: (row) => row.phoneNumber || "—" },
  {
    key: "role",
    label: "Role",
    render: (row) => <Badge>{row.role === "Admin" ? "Super admin" : row.role}</Badge>,
  },
  {
    key: "created",
    label: "Created",
    render: (row) => formatBackendDate(row.createdOn),
  },
];

export default function AdminSupervisorsPage() {
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [role, setRole] = useState<AdminRoleFilter>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createdMessage, setCreatedMessage] = useState<string | null>(null);

  const loadAdmins = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await adminHttpApi.list(page, pageSize, role);
      setRows(result.items ?? []);
      setTotal(result.totalCount ?? 0);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load administrators.");
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, role]);

  useEffect(() => {
    // The request callback updates loading and result state after this external API sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadAdmins();
  }, [loadAdmins]);

  async function createAdmin(formData: FormData) {
    try {
      setCreating(true);
      setError(null);
      setCreatedMessage(null);
      const selectedRole = formData.get("role") as AdminRole;
      await adminHttpApi.create({
        firstName: String(formData.get("firstName") ?? ""),
        lastName: String(formData.get("lastName") ?? ""),
        email: String(formData.get("email") ?? ""),
        phoneNumber: String(formData.get("phoneNumber") ?? ""),
        password: String(formData.get("password") ?? ""),
        role: selectedRole,
      });
      const message = selectedRole === "Admin" ? "Super admin created." : "Supervisor created.";
      setCreatedMessage(message);
      toast.success(message);
      setShowCreate(false);
      setPage(1);
      await loadAdmins();
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to create administrator.";
      setError(message);
      toast.error(message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <PageHeader
          title="Administrators"
          subtitle="Create and manage supervisors and super administrators."
          role="super_admin"
        />
        <Button type="button" onClick={() => setShowCreate((value) => !value)}>
          {showCreate ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showCreate ? "Close" : "Create administrator"}
        </Button>
      </div>

      {showCreate ? (
        <Card className="p-5">
          <h2 className="text-lg font-semibold">New administrator</h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Choose Supervisor or Super admin; the backend receives Supervisor or Admin respectively.
          </p>
          <form action={createAdmin} className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="First name" name="firstName" autoComplete="given-name" />
            <Field label="Last name" name="lastName" autoComplete="family-name" />
            <Field label="Email" name="email" type="email" autoComplete="email" />
            <Field label="Phone number" name="phoneNumber" type="tel" autoComplete="tel" />
            <Field label="Temporary password" name="password" type="password" autoComplete="new-password" />
            <label className="block text-sm font-medium">
              Role
              <select
                name="role"
                defaultValue="Supervisor"
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none"
              >
                <option value="Supervisor">Supervisor</option>
                <option value="Admin">Super admin</option>
              </select>
            </label>
            <div className="md:col-span-2">
              <Button type="submit" disabled={creating}>
                {creating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                Create account
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      {createdMessage ? <p className="text-sm text-emerald-700">{createdMessage}</p> : null}
      {error ? <p className="text-sm text-[#b42318]">{error}</p> : null}

      <Card className="p-5">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Administrator directory</h2>
            <p className="text-sm text-[var(--muted-foreground)]">{total} administrator accounts</p>
          </div>
          <select
            value={role}
            onChange={(event) => {
              setRole(event.target.value as AdminRoleFilter);
              setPage(1);
            }}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none"
          >
            <option value="">All roles</option>
            <option value="Supervisor">Supervisors</option>
            <option value="Admin">Super admins</option>
          </select>
        </div>
        <PaginatedDataTable
          columns={columns}
          rows={rows}
          getRowId={(row) => row.id}
          page={page}
          pageSize={pageSize}
          total={total}
          loading={loading}
          emptyMessage="No administrators found."
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </Card>
    </div>
  );
}

function Field({ label, name, type, ...props }: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <label className="block text-sm font-medium">
      {label}
      <span className={isPassword ? "relative mt-2 block" : "mt-2 block"}>
        <Input
          className={isPassword ? "pr-11" : undefined}
          name={name}
          required
          type={isPassword && showPassword ? "text" : type}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute inset-y-0 right-0 flex w-11 cursor-pointer items-center justify-center text-[var(--muted-foreground)]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        ) : null}
      </span>
    </label>
  );
}