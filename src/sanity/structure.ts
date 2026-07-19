import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
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
 * not the way the schema is technically organised. Squad, Transfer Deals
 * and Sponsors use orderableDocumentListDeskItem (drag-and-drop
 * reordering, backed by the orderRank field on each of those schemas)
 * instead of the plain alphabetical/creation-order list — no more typing
 * a number into a "Display order" field and guessing. It returns a
 * ready-made list item itself (not something to wrap in .child()).
 */
export const structure: StructureResolver = (S, context) => {
  const squadPositions: { position: string; title: string; id: string }[] = [
    { position: "Forward", title: "Forwards", id: "orderable-player-forward" },
    { position: "Midfielder", title: "Midfielders", id: "orderable-player-midfielder" },
    { position: "Defender", title: "Defenders", id: "orderable-player-defender" },
    { position: "Goalkeeper", title: "Goalkeepers", id: "orderable-player-goalkeeper" },
  ];

  return S.list()
    .title("Madrid Zone")
    .items([
      S.listItem().title("📰 Articles").child(S.documentTypeList("article").title("Articles")),
      S.listItem().title("✍️ Authors").child(S.documentTypeList("author").title("Authors")),
      S.divider(),
      S.listItem()
        .title("⚽ Squad")
        .child(
          S.list()
            .title("Squad")
            .items(
              squadPositions.map(({ position, title, id }) =>
                orderableDocumentListDeskItem({
                  type: "player",
                  id,
                  title,
                  filter: `_type == "player" && position == $position`,
                  params: { position },
                  S,
                  context,
                })
              )
            )
        ),
      S.listItem().title("🏟️ Clubs").child(S.documentTypeList("club").title("Clubs")),
      S.divider(),
      S.listItem()
        .title("🔄 Transfer Centre")
        .child(
          S.list()
            .title("Transfer Centre")
            .items([
              orderableDocumentListDeskItem({ type: "transferDeal", title: "Deals", S, context }),
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
      orderableDocumentListDeskItem({ type: "sponsor", title: "🤝 Sponsors", S, context }),
      S.listItem().title("📢 Live Ticker").child(S.documentTypeList("wireItem").title("Live Ticker")),
      S.listItem().title("📄 Legal Pages").child(S.documentTypeList("legalPage").title("Legal Pages")),
      S.divider(),
      singleton(S, "adSlot", "🖼️ Ad Slot"),
      singleton(S, "siteSettings", "⚙️ Site Settings"),
    ]);
};
