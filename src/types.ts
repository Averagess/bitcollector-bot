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

export interface LeaderboardItem {
  discordDisplayName: string;
  cps: number;
  balance: string;
}
