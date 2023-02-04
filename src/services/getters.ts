import axios from "axios";

import { Leaderboard, Item } from "../types";
import { APIKEY, BACKEND_URL } from "../utils/config";

const headers = {
  authorization: `Bearer ${APIKEY}`,
};

export const getLeaderboard = async () => {
  const { data, status } = await axios.get<Leaderboard>(`${BACKEND_URL}/leaderboard`, { headers });
  return { data, status };
};

export const getItems = async () => {
  const { data, status } = await axios.get<Item[]>(`${BACKEND_URL}/allItems`, { headers });
  return { data, status };
};