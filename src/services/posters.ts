import axios from "axios";

import { InventoryItem, Player, PurchaseResponse, RedeemDailyResponse } from "../types";
import { APIKEY, BACKEND_URL } from "../utils/config";

const headers = {
  authorization: `Bearer ${APIKEY}`,
}

export const fetchPlayerProfile = async (discordId: string) => {
  const body = {
    discordId,
  }

  const { data, status } = await axios.post<Player>(`${BACKEND_URL}/updatePlayer`, body, { headers });
  return { data, status};
}

export const buyItem = async (discordId: string, itemName: string, amount: number) => {
  const body = {
    discordId,
    itemName,
    amount,
  }

  const { data, status } = await axios.post<PurchaseResponse>(`${BACKEND_URL}/buyItem`, body, { headers });
  return { data, status};
}

export const createAccount = async (discordId: string, discordDisplayName: string) => {
  const body = {
    discordId,
    discordDisplayName,
  }
  const { data, status } = await axios.post<Player>(`${BACKEND_URL}/initPlayer`, body, { headers });
  return { data, status};
}

export const redeemDaily = async (discordId: string) => {
  const body = {
    discordId,
  }

  const { data, status } = await axios.post<RedeemDailyResponse>(`${BACKEND_URL}/redeemDaily`, body, { headers });
  return { data, status};
}

export const resetPlayer = async (discordId: string) => {
  const body = {
    discordId,
  }

  const { data, status } = await axios.post(`${BACKEND_URL}/resetPlayer`, body, { headers });

  return { data, status };
}

export const fetchPlayerStore = async (discordId: string) => {
  const body = {
    discordId,
  }

  const { data, status } = await axios.post<InventoryItem[]>(`${BACKEND_URL}/getStoreForPlayer`, body, { headers });
  return { data, status };
}


export const addBitToPlayer = async (discordId: string) => {
  const body = {
    discordId,
  }

  const { data, status } = await axios.post<Player>(`${BACKEND_URL}/addBitToPlayer`, body, { headers });
  return { data, status };
}