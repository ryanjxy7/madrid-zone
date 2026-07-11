import type { Metadata } from "next";
import { AnalysisCard } from "@/components/article/AnalysisCard";
import { getAnalysisArticles } from "@/lib/data/articles";

export const metadata: Metadata = {
  title: "Analysis",
  description: "Long reads on Real Madrid tactics, finance, data and the academy.",
  alternates: { canonical: "/analysis" },
};

export default async function AnalysisPage() {
  const posts = await getAnalysisArticles();

  return (
    <div className="flex flex-1 flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-[28px] font-bold tracking-[0.02em] text-heading sm:text-[34px]">ANALYSIS</h1>
        <p className="font-body text-[13px] text-muted">Long reads: tactics, finance, data and the academy.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <AnalysisCard key={post.slug} article={post} />
        ))}
      </div>
    </div>
  );
}
