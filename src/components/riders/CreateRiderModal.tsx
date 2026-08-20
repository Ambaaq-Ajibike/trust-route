"use client";

import { useState } from "react";
import { Eye, EyeOff, LoaderCircle, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { ridersApi } from "@/features/riders/api";

type CreateRiderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
  residentialAddress: "",
  nin: "",
  driversLicense: "",
  vehicleType: "Motorcycle",
  vehiclePlateNumber: "",
  nextOfKinFirstName: "",
  nextOfKinLastName: "",
  nextOfKinPhoneNumber: "",
  nextOfKinRelationship: "Sibling",
  nextOfKinAddress: "",
};

export function CreateRiderModal({ isOpen, onClose, onSuccess }: CreateRiderModalProps) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await ridersApi.createRiderBySupervisor({
        FirstName: form.firstName,
        LastName: form.lastName,
        Email: form.email,
        PhoneNumber: form.phoneNumber,
        Password: form.password,
        ResidentialAddress: form.residentialAddress,
        Nin: form.nin,
        DriversLicense: form.driversLicense,
        VehicleType: form.vehicleType,
        VehiclePlateNumber: form.vehiclePlateNumber,
        NextOfKinFirstName: form.nextOfKinFirstName,
        NextOfKinLastName: form.nextOfKinLastName,
        NextOfKinPhoneNumber: form.nextOfKinPhoneNumber,
        NextOfKinRelationship: form.nextOfKinRelationship,
        NextOfKinAddress: form.nextOfKinAddress,
      });

      toast.success("Rider account registered successfully.");
      setForm(initialForm);
      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unable to register rider account.";
      setError(msg);
      toast.error(msg);
      // NOTE: Form state is preserved so typed values are not lost on failure.
    } finally {
      setLoading(false);
    }
  }

  function update(field: keyof typeof initialForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="my-8 w-full max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div>
            <h2 className="text-xl font-semibold">Register new rider account</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              Create a new rider account as a Supervisor.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--surface-muted)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-[#fec4c0] bg-[#fffbfa] p-3 text-sm text-[#b42318]">
            <strong>Backend Error:</strong> {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Section 1: Account Information */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              1. Personal & Account Credentials
            </h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium">
                First name
                <Input
                  required
                  className="mt-1.5"
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium">
                Last name
                <Input
                  required
                  className="mt-1.5"
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium">
                Email address
                <Input
                  required
                  type="email"
                  className="mt-1.5"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium">
                Phone number
                <Input
                  required
                  type="tel"
                  className="mt-1.5"
                  value={form.phoneNumber}
                  onChange={(e) => update("phoneNumber", e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium md:col-span-2">
                Temporary password
                <span className="relative mt-1.5 block">
                  <Input
                    required
                    type={showPassword ? "text" : "password"}
                    className="pr-11"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[var(--muted-foreground)]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
              </label>
              <label className="block text-sm font-medium md:col-span-2">
                Residential address
                <Input
                  required
                  className="mt-1.5"
                  value={form.residentialAddress}
                  onChange={(e) => update("residentialAddress", e.target.value)}
                />
              </label>
            </div>
          </div>

          {/* Section 2: Vehicle & Identification */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              2. Vehicle & Verification
            </h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium">
                NIN (National Identity Number)
                <Input
                  required
                  className="mt-1.5"
                  value={form.nin}
                  onChange={(e) => update("nin", e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium">
                Driver&apos;s license number
                <Input
                  required
                  className="mt-1.5"
                  value={form.driversLicense}
                  onChange={(e) => update("driversLicense", e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium">
                Vehicle type
                <select
                  value={form.vehicleType}
                  onChange={(e) => update("vehicleType", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none"
                >
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Bicycle">Bicycle</option>
                  <option value="Van">Van / Cargo</option>
                  <option value="Car">Car</option>
                </select>
              </label>
              <label className="block text-sm font-medium">
                Vehicle plate number
                <Input
                  required
                  className="mt-1.5"
                  value={form.vehiclePlateNumber}
                  onChange={(e) => update("vehiclePlateNumber", e.target.value)}
                />
              </label>
            </div>
          </div>

          {/* Section 3: Next of Kin */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              3. Next of Kin Details
            </h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium">
                Next of kin first name
                <Input
                  required
                  className="mt-1.5"
                  value={form.nextOfKinFirstName}
                  onChange={(e) => update("nextOfKinFirstName", e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium">
                Next of kin last name
                <Input
                  required
                  className="mt-1.5"
                  value={form.nextOfKinLastName}
                  onChange={(e) => update("nextOfKinLastName", e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium">
                Next of kin phone
                <Input
                  required
                  type="tel"
                  className="mt-1.5"
                  value={form.nextOfKinPhoneNumber}
                  onChange={(e) => update("nextOfKinPhoneNumber", e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium">
                Relationship
                <Input
                  required
                  className="mt-1.5"
                  value={form.nextOfKinRelationship}
                  onChange={(e) => update("nextOfKinRelationship", e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium md:col-span-2">
                Next of kin address
                <Input
                  required
                  className="mt-1.5"
                  value={form.nextOfKinAddress}
                  onChange={(e) => update("nextOfKinAddress", e.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              Register rider
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
