import { Client, Collection } from "discord.js";

export interface extendedClient extends Client {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  commands?: Collection<string, any>;
}

export interface Player {
  discordDisplayName: string
  discordId: string
  balance: string
  cps: number
  inventory: InventoryItem[]
  lastDaily: string
  dailyCount: number
  openedCrates: number
  unopenedCrates: number
  blacklisted: null | { reason: string, started : string}
  blacklistHistory : { reason: string, started : string, ended: string}[]
  createdAt: string
  updatedAt: string
}

export interface PurchaseResponse {
  player: Player
  purchasedItem: InventoryItem
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
  discordId: string
  discordDisplayName: string;
  cps: number;
  balance: string;
}

export interface RedeemDailyResponse {
  balanceReward: number
  itemReward: {
    name: string | null
    amount: number | null
    cps: number | null
  }
}

export interface RedeemCrateResponse {
  balanceReward: number
  itemReward: {
    name: string,
    amount: number,
    cps: number
  }
}

export interface ClientActivity {
  name: string;
  type: number
}

export interface fetchTwoPlayersResponse {
  client: Player;
  target: Player;
}