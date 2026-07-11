import type { Metadata } from "next";
import { SquadGroupSection } from "@/components/squad/SquadGroupSection";
import { getSquad } from "@/lib/data/squad";

export const metadata: Metadata = {
  title: "First-Team Squad",
  description: "The Real Madrid first-team squad — profiles, shirt numbers and roles.",
  alternates: { canonical: "/squad" },
};

export default async function SquadPage() {
  const squadGroups = await getSquad();

  return (
    <div className="flex flex-1 flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-[28px] font-bold tracking-[0.02em] text-heading sm:text-[34px]">
          FIRST-TEAM SQUAD
        </h1>
        <p className="font-body text-[13px] text-muted">2026–27 season · profiles, numbers and roles.</p>
      </div>

      <div className="flex flex-col gap-8">
        {squadGroups.map((group) => (
          <SquadGroupSection key={group.label} group={group} />
        ))}
      </div>
    </div>
  );
}
