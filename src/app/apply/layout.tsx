import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply for Spark",
  description:
    "Apply for a Spark prepaid Mastercard from home. Six details, three documents, no branch visit.",
  // A prototype application form has no business in search results.
  robots: { index: false, follow: false },
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
