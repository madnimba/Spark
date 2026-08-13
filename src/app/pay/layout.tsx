import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment",
  description: "Spark card issuance fee.",
  // Never index a page that resembles a payment gateway.
  robots: { index: false, follow: false },
};

export default function PayLayout({ children }: { children: React.ReactNode }) {
  return children;
}
