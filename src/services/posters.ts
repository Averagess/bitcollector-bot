import axios from "axios";

import { fetchTwoPlayersResponse, InventoryItem, Player, PurchaseResponse, RedeemCrateResponse, RedeemDailyResponse } from "../types";
import { APIKEY, BACKEND_URL } from "../utils/config";

const headers = {
  authorization: `Bearer ${APIKEY}`,
}

export const fetchPlayerProfile = async (discordId: string, discordDisplayName: string) => {
  const body = {
    discordId,
    discordDisplayName,
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

export const fetchPlayerShop = async (discordId: string) => {
  const body = {
    discordId,
  }

  const { data, status } = await axios.post<InventoryItem[]>(`${BACKEND_URL}/getShopForPlayer`, body, { headers });
  return { data, status };
}


export const addBitToPlayer = async (discordId: string) => {
  const body = {
    discordId,
  }

  const { data, status } = await axios.post<Player>(`${BACKEND_URL}/addBitToPlayer`, body, { headers });
  return { data, status };
}

export const openCrate = async (discordId: string) => {
  const body = {
    discordId
  }

  const { data } = await axios.post<RedeemCrateResponse>(`${BACKEND_URL}/openCrate`, body, { headers });

  return { data };
}

export const fetchTwoPlayers = async (clientId: string, targetId: string) => {
  const body = {
    clientId,
    targetId,
  }

  const { data, status } = await axios.post<fetchTwoPlayersResponse>(`${BACKEND_URL}/updateTwoPlayers`, body, { headers });
  return { data, status };
}