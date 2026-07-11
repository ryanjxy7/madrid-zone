import type { StructureResolver } from "sanity/structure";

/** A one-off document that always resolves to the same, fixed document ID. */
function singleton(S: Parameters<StructureResolver>[0], typeName: string, title: string) {
  return S.listItem()
    .id(typeName)
    .title(title)
    .child(S.document().schemaType(typeName).documentId(typeName));
}

/**
 * A friendly, task-oriented menu instead of Sanity's default alphabetical
 * document-type list — grouped the way an editor thinks about the site,
 * not the way the schema is technically organised.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Madrid Zone")
    .items([
      S.listItem().title("📰 Articles").child(S.documentTypeList("article").title("Articles")),
      S.listItem().title("✍️ Authors").child(S.documentTypeList("author").title("Authors")),
      S.divider(),
      S.listItem().title("⚽ Squad").child(S.documentTypeList("player").title("Squad")),
      S.divider(),
      S.listItem()
        .title("🔄 Transfer Centre")
        .child(
          S.list()
            .title("Transfer Centre")
            .items([
              S.listItem().title("Deals").child(S.documentTypeList("transferDeal").title("Transfer Deals")),
              S.listItem().title("Rumour Mill").child(S.documentTypeList("rumour").title("Rumour Mill")),
            ])
        ),
      S.listItem()
        .title("🗓️ Matches")
        .child(
          S.list()
            .title("Matches")
            .items([
              singleton(S, "nextMatch", "Next Match"),
              S.listItem().title("Upcoming Fixtures").child(S.documentTypeList("fixture").title("Upcoming Fixtures")),
              S.listItem().title("Recent Results").child(S.documentTypeList("matchResult").title("Recent Results")),
              singleton(S, "leagueTable", "League Table"),
            ])
        ),
      singleton(S, "seasonStats", "📊 Season Stats"),
      S.divider(),
      S.listItem().title("🤝 Sponsors").child(S.documentTypeList("sponsor").title("Sponsors")),
      S.listItem().title("📢 Live Ticker").child(S.documentTypeList("wireItem").title("Live Ticker")),
      S.listItem().title("📄 Legal Pages").child(S.documentTypeList("legalPage").title("Legal Pages")),
      S.divider(),
      singleton(S, "siteSettings", "⚙️ Site Settings"),
    ]);
