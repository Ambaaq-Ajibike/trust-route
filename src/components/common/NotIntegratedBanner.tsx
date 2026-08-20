import { AlertCircle } from "lucide-react";

type NotIntegratedBannerProps = {
  featureName: string;
  endpoint?: string;
  message?: string;
};

export function NotIntegratedBanner({ featureName, endpoint, message }: NotIntegratedBannerProps) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6 text-amber-900 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-base">{featureName} - Not Yet Integrated</h3>
          <p className="text-sm text-amber-800">
            {message || `The backend API endpoint for ${featureName} is not yet available on the server.`}
          </p>
          {endpoint ? (
            <p className="text-xs font-mono text-amber-700/80 pt-1">
              Target endpoint: <code className="rounded bg-amber-100 px-1.5 py-0.5">{endpoint}</code>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
