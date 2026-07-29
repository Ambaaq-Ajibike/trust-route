"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, KeyRound, LoaderCircle, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { authApi } from "@/features/auth/api";
import { changePasswordSchema } from "@/features/auth/schemas";
import type { ChangePasswordInput } from "@/features/auth/types";

export function ChangePasswordModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [visibleField, setVisibleField] = useState<keyof ChangePasswordInput | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  if (!open) {
    return null;
  }

  const close = () => {
    reset();
    setError(null);
    setSuccess(false);
    setVisibleField(null);
    onClose();
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      setError(null);
      await authApi.changePassword(values);
      setSuccess(true);
      toast.success("Password updated successfully.");
      reset();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Password update failed.";
      setError(message);
      toast.error(message);
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--surface-muted)] text-[var(--color-accent)]">
              <KeyRound className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-semibold">Change password</h2>
              <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                Update the password used to access this dashboard.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-full text-[var(--muted-foreground)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
            onClick={close}
            aria-label="Close change password"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="space-y-4 p-5" onSubmit={onSubmit}>
          <PasswordField
            label="Current password"
            autoComplete="current-password"
            field="currentPassword"
            visibleField={visibleField}
            setVisibleField={setVisibleField}
            register={register}
            error={errors.currentPassword?.message}
          />
          <PasswordField
            label="New password"
            autoComplete="new-password"
            field="newPassword"
            visibleField={visibleField}
            setVisibleField={setVisibleField}
            register={register}
            error={errors.newPassword?.message}
          />
          <PasswordField
            label="Confirm new password"
            autoComplete="new-password"
            field="confirmPassword"
            visibleField={visibleField}
            setVisibleField={setVisibleField}
            register={register}
            error={errors.confirmPassword?.message}
          />

          {error ? <p className="text-sm text-[#b42318]">{error}</p> : null}
          {success ? (
            <p className="rounded-xl bg-[#ecfdf3] px-3 py-2 text-sm font-medium text-[#027a48]">
              Password updated successfully.
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              Update password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  autoComplete,
  field,
  visibleField,
  setVisibleField,
  register,
  error,
}: {
  label: string;
  autoComplete: string;
  field: keyof ChangePasswordInput;
  visibleField: keyof ChangePasswordInput | null;
  setVisibleField: (field: keyof ChangePasswordInput | null) => void;
  register: ReturnType<typeof useForm<ChangePasswordInput>>["register"];
  error?: string;
}) {
  const visible = visibleField === field;

  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <div className="relative">
        <Input
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          className="pr-11"
          {...register(field)}
        />
        <button
          type="button"
          onClick={() => setVisibleField(visible ? null : field)}
          className="absolute inset-y-0 right-0 flex w-11 cursor-pointer items-center justify-center text-[var(--muted-foreground)]"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error ? <p className="mt-1 text-xs text-[#b42318]">{error}</p> : null}
    </div>
  );
}
