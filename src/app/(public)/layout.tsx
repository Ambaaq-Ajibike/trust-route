import Image from "next/image";
import Link from "next/link";
import { Activity, FileSearch, ShieldCheck } from "lucide-react";
import { TrustRouteLogo } from "@/components/common/TrustRouteLogo";

const authImage = "/images/ops-warehouse-floor.jpg";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-screen bg-[var(--background)] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden lg:block">
        <Image
          src={authImage}
          alt="Dispatch operations and delivery logistics"
          fill
          priority
          className="object-cover"
          sizes="55vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,24,35,0.70),rgba(9,24,35,0.40),rgba(9,24,35,0.82))]" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
          <Link href="/" className="flex items-center gap-3">
            <TrustRouteLogo inverse />
          </Link>
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white/86 backdrop-blur">
              <Activity className="h-4 w-4" />
              Operations console
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-normal">
              Verify riders, monitor exceptions, and keep every action accountable.
            </h1>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/18 bg-white/12 p-4 backdrop-blur">
                <FileSearch className="mb-3 h-5 w-5" />
                <div className="text-sm font-medium">Document review</div>
                <div className="mt-1 text-xs text-white/72">Image and PDF workflows</div>
              </div>
              <div className="rounded-2xl border border-white/18 bg-white/12 p-4 backdrop-blur">
                <ShieldCheck className="mb-3 h-5 w-5" />
                <div className="text-sm font-medium">Audit controls</div>
                <div className="mt-1 text-xs text-white/72">Permissioned actions</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-10 md:px-8">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </div>
  );
}
