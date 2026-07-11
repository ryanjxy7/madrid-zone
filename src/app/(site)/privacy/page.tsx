import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPageView } from "@/components/legal/LegalPageView";
import { getLegalPage } from "@/lib/data/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Madrid Zone collects, uses and protects your data.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const page = await getLegalPage("privacy");
  if (!page) notFound();
  return <LegalPageView page={page} />;
}
