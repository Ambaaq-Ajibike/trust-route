import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bike,
  Box,
  Building2,
  CheckCircle2,
  Clock3,
  MapPinned,
  PackageCheck,
  PhoneCall,
  ShieldCheck,
  Star,
  Truck,
  UsersRound,
} from "lucide-react";
import { routes } from "@/config/routes";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { TrustRouteLogo } from "@/components/common/TrustRouteLogo";

const heroImage = "/images/ops-warehouse-hero.jpg";

const customerStats = [
  { label: "Same-city delivery flow", value: "Pickup to proof" },
  { label: "Rider onboarding", value: "Verified IDs" },
  { label: "Receiver confirmation", value: "Secure code" },
];

const benefits = [
  {
    icon: Box,
    title: "Send packages without chasing updates",
    text: "Create a delivery, add package photos, set pickup and drop-off details, and follow the order from request to receiver confirmation.",
  },
  {
    icon: Bike,
    title: "Work with verified riders",
    text: "Riders complete identity, vehicle, and document checks before they can go live and accept delivery work.",
  },
  {
    icon: ShieldCheck,
    title: "Confirm delivery with evidence",
    text: "Receivers verify handoff with a delivery code, so completed trips have a clearer proof trail.",
  },
];

const appSteps = [
  "Create a delivery request with package details",
  "Receive rider bids and select the best fit",
  "Track the delivery as pickup and transit updates change",
  "Receiver confirms handoff with a secure code",
];

const audiences = [
  {
    icon: PackageCheck,
    title: "For senders",
    text: "Move personal parcels, business orders, and urgent city deliveries with clearer pricing and status visibility.",
  },
  {
    icon: UsersRound,
    title: "For receivers",
    text: "Receive simple delivery links and confirm arrival without needing a full account workflow.",
  },
  {
    icon: Building2,
    title: "For growing businesses",
    text: "Keep dispatch, rider selection, payment status, and delivery history easier to inspect as order volume grows.",
  },
];

const trustSignals = [
  "Rider document checks",
  "Package photo records",
  "Pickup and drop-off previews",
  "Receiver delivery codes",
  "Payment status visibility",
  "Support-ready delivery history",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="relative min-h-[92vh] overflow-hidden">
        <Image
          src={heroImage}
          alt="Delivery team preparing packages for dispatch"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,24,35,0.88),rgba(9,24,35,0.62),rgba(9,24,35,0.16))]" />
        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="text-white">
            <TrustRouteLogo inverse />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#how-it-works"
              className="hidden cursor-pointer rounded-xl px-3 py-2 text-sm font-medium text-white/86 transition hover:bg-white/12 hover:text-white md:inline-flex"
            >
              How it works
            </a>
            <a
              href="#trust"
              className="hidden cursor-pointer rounded-xl px-3 py-2 text-sm font-medium text-white/86 transition hover:bg-white/12 hover:text-white md:inline-flex"
            >
              Trust
            </a>
            <Link href={routes.login}>
              <Button className="border border-white/20 bg-[#f59e0b] text-[#101b2a] shadow-lg shadow-black/20 hover:bg-[#fbbf24] hover:text-[#101b2a]">
                Sign in
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 pb-14 pt-16 md:px-8 md:pt-24 lg:grid-cols-[0.92fr_0.66fr] lg:items-end">
          <div className="max-w-3xl text-white">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white/86 backdrop-blur">
              <Truck className="h-4 w-4" />
              Delivery built around trust and visibility
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-normal md:text-7xl">
              Send packages with verified riders and clearer delivery proof.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/84">
              TrustRoute helps senders move packages through vetted riders, real
              status updates, package photo records, and receiver confirmation at
              the point of delivery.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#how-it-works">
                <Button>
                  See how it works
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <a
                href="#who-its-for"
                className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-white/28 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/12"
              >
                Explore use cases
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/16 bg-white/12 p-4 text-white shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/14 pb-3">
              <div>
                <div className="text-sm font-medium">Delivery experience</div>
                <div className="text-xs text-white/62">Designed for sender confidence</div>
              </div>
              <MapPinned className="h-5 w-5 text-[#f59e0b]" />
            </div>
            <div className="mt-3 grid gap-3">
              {customerStats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between rounded-xl bg-white/10 p-3">
                  <span className="text-xs leading-5 text-white/70">{stat.label}</span>
                  <span className="text-sm font-semibold">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:px-8 lg:grid-cols-[0.86fr_1.14fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--surface-muted)] px-3 py-1 text-sm text-[var(--muted-foreground)]">
              <Star className="h-4 w-4 text-[#f59e0b]" />
              Why TrustRoute
            </div>
            <h2 className="text-3xl font-semibold tracking-normal md:text-4xl">
              Delivery should feel transparent from the first request to the final handoff.
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--muted-foreground)]">
              The product combines sender controls, rider verification, delivery
              tracking, and receiver confirmation into a single flow that is easier
              to trust than informal dispatch.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {benefits.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="p-5">
                  <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-[var(--surface-muted)] text-[var(--color-accent)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                    {item.text}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
          <div className="relative aspect-[16/10]">
            <Image
              src="/images/ops-warehouse-floor.jpg"
              alt="Warehouse staff coordinating parcel movement"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(0deg,rgba(9,24,35,0.82),transparent)] p-5 text-white">
              <div className="flex items-center gap-2 text-sm">
                <Clock3 className="h-4 w-4" />
                A delivery flow that keeps sender, rider, and receiver aligned
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-semibold tracking-normal md:text-4xl">
            A practical flow for local deliveries.
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--muted-foreground)]">
            TrustRoute is structured around the steps customers already care about:
            request, rider selection, pickup, tracking, and proof of delivery.
          </p>
          <div className="mt-6 space-y-3">
            {appSteps.map((item, index) => (
              <div key={item} className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--surface-muted)] text-sm font-semibold text-[var(--color-accent)]">
                  {index + 1}
                </div>
                <div className="text-sm font-medium">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="who-its-for" className="bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-normal md:text-4xl">
              Built for daily senders and growing businesses.
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--muted-foreground)]">
              Whether the package is personal, urgent, or part of a business order,
              TrustRoute keeps the delivery journey easier to inspect.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {audiences.map((audience) => {
              const Icon = audience.icon;
              return (
                <Card key={audience.title} className="p-5">
                  <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-[var(--surface-muted)] text-[var(--color-accent)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{audience.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                    {audience.text}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="trust" className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:px-8 lg:grid-cols-[0.86fr_1.14fr]">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--surface-muted)] px-3 py-1 text-sm text-[var(--muted-foreground)]">
            <BadgeCheck className="h-4 w-4 text-[var(--color-accent)]" />
            Trust signals
          </div>
          <h2 className="text-3xl font-semibold tracking-normal md:text-4xl">
            More context around every delivery.
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--muted-foreground)]">
            TrustRoute keeps practical delivery evidence attached to the job, so
            support and customers have a clearer picture when something needs review.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {trustSignals.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[#101b2a] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:px-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <TrustRouteLogo inverse />
            <h2 className="mt-6 max-w-2xl text-3xl font-semibold tracking-normal">
              A clearer way to send, track, and confirm local deliveries.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
              TrustRoute brings delivery requests, verified riders, status updates,
              and receiver proof into one customer-focused experience.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#how-it-works">
              <Button className="bg-white text-[#132033] hover:bg-white/90">
                Learn more
                <PhoneCall className="h-4 w-4" />
              </Button>
            </a>
            <Link href={routes.login}>
              <Button className="border border-white/20 bg-[#f59e0b] text-[#101b2a] hover:bg-[#fbbf24]">
                Sign in
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
