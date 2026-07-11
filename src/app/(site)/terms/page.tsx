import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPageView } from "@/components/legal/LegalPageView";
import { getLegalPage } from "@/lib/data/legal";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that govern your use of Madrid Zone.",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const page = await getLegalPage("terms");
  if (!page) notFound();
  return <LegalPageView page={page} />;
}
