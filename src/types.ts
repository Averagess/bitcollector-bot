export interface Player {
  discordDisplayName: string
  discordId: string
  balance: string
  cps: number
  inventory: InventoryItem[]
  createdAt: Date
  updatedAt: Date
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
