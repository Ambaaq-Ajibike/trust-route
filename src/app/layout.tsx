import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/providers/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "TrustRoute",
  title: {
    default: "TrustRoute | Verified Delivery Management Platform",
    template: "%s | TrustRoute",
  },
  description:
    "TrustRoute helps customers send packages with verified riders, transparent delivery tracking, package photo evidence, receiver confirmation, and operational dashboards for rider approvals, deliveries, disputes, refunds, finance, and platform administration.",
  keywords: [
    "TrustRoute",
    "delivery management",
    "verified riders",
    "package delivery",
    "logistics dashboard",
    "rider verification",
    "delivery tracking",
    "proof of delivery",
    "courier operations",
  ],
  authors: [{ name: "Techcraft" }],
  creator: "Techcraft",
  publisher: "Techcraft",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "TrustRoute | Verified Delivery Management Platform",
    description:
      "Send packages through verified riders with clearer tracking, delivery evidence, receiver confirmation, and operational controls for growing logistics teams.",
    siteName: "TrustRoute",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "TrustRoute | Verified Delivery Management Platform",
    description:
      "Verified rider delivery, package tracking, proof capture, and operational dashboards for delivery teams.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
