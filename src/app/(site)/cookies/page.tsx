import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPageView } from "@/components/legal/LegalPageView";
import { getLegalPage } from "@/lib/data/legal";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Madrid Zone uses cookies and how to manage your consent.",
  alternates: { canonical: "/cookies" },
};

export default async function CookiesPage() {
  const page = await getLegalPage("cookies");
  if (!page) notFound();
  return <LegalPageView page={page} />;
}
