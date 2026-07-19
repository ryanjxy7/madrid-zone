import { placeholderImage } from "@/lib/utils/images";
import type { SquadGroup } from "@/types/football";

export const placeholderSquad: SquadGroup[] = [
  {
    label: "FORWARDS",
    players: [
      { id: "fw-1", number: "7", name: "Vinícius Jr", role: "Left wing", position: "Forward", image: placeholderImage("player-vinicius", 450, 600) },
      { id: "fw-2", number: "9", name: "K. Mbappé", role: "Striker", position: "Forward", image: placeholderImage("player-mbappe", 450, 600) },
      { id: "fw-3", number: "11", name: "Rodrygo", role: "Right wing", position: "Forward", image: placeholderImage("player-rodrygo", 450, 600) },
      { id: "fw-4", number: "16", name: "Endrick", role: "Striker", position: "Forward", image: placeholderImage("player-endrick", 450, 600) },
    ],
  },
  {
    label: "MIDFIELDERS",
    players: [
      { id: "mf-1", number: "14", name: "A. Tchouaméni", role: "Defensive midfield", position: "Midfielder", image: placeholderImage("player-tchouameni", 450, 600) },
      { id: "mf-2", number: "8", name: "F. Valverde", role: "Central midfield", position: "Midfielder", image: placeholderImage("player-valverde", 450, 600) },
      { id: "mf-3", number: "6", name: "E. Camavinga", role: "Central midfield", position: "Midfielder", image: placeholderImage("player-camavinga", 450, 600) },
      { id: "mf-4", number: "5", name: "J. Bellingham", role: "Attacking midfield", position: "Midfielder", image: placeholderImage("player-bellingham", 450, 600) },
    ],
  },
  {
    label: "DEFENDERS",
    players: [
      { id: "df-1", number: "2", name: "D. Carvajal", role: "Right-back", position: "Defender", image: placeholderImage("player-carvajal", 450, 600) },
      { id: "df-2", number: "3", name: "É. Militão", role: "Centre-back", position: "Defender", image: placeholderImage("player-militao", 450, 600) },
      { id: "df-3", number: "22", name: "A. Rüdiger", role: "Centre-back", position: "Defender", image: placeholderImage("player-rudiger", 450, 600) },
      { id: "df-4", number: "17", name: "F. García", role: "Left-back", position: "Defender", image: placeholderImage("player-garcia", 450, 600) },
    ],
  },
  {
    label: "GOALKEEPERS",
    players: [
      { id: "gk-1", number: "1", name: "T. Courtois", role: "Goalkeeper", position: "Goalkeeper", image: placeholderImage("player-courtois", 450, 600) },
      { id: "gk-2", number: "13", name: "A. Lunin", role: "Goalkeeper", position: "Goalkeeper", image: placeholderImage("player-lunin", 450, 600) },
    ],
  },
];
