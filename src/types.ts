import { Client, Collection } from "discord.js";

export interface extendedClient extends Client {
  commands?: Collection<string, any>;
}

export interface Player {
  discordDisplayName: string
  discordId: string
  balance: string
  cps: number
  inventory: InventoryItem[]
  createdAt: string
  updatedAt: string
}

export interface InventoryItem {
  name: string
  price: number
  cps: number
  amount: number
}

export interface Leaderboard {
  players: PlayerInLeaderboard[] | null
  createdAt: string | null
  nextUpdate: string | null
}

export interface PlayerInLeaderboard {
  discordId: String
  discordDisplayName: string;
  cps: number;
  balance: string;
}
