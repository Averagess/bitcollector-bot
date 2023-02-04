import { writeFileSync } from "fs";
import logger from "./logger";
import { getItems } from "../services/getters";
import { extendedClient } from "../types";
import pickNewActivity from "./pickNewActivity";
import clientActivities from "../resources/clientActivities";
import { ActivityType } from "discord.js";

export const updateItems = async () => {
  logger.info("Updating stored items...");
  try {
    const { data } = await getItems();
    const path = __dirname + "/../resources/items.json";
    console.log(path);
    writeFileSync(path, JSON.stringify(data));
    logger.info("Successfully updated and saved stored items to /resources/items.json");
  } catch (error) {
    logger.error(`Error when updating stored items!: error: ${error}`);
  }
};

export const updateClientActivity = async (client: extendedClient) => {
  logger.info("Switching client activity...");
  const currentActivity = { name: client.user?.presence?.activities[0]?.name, type: client.user?.presence?.activities[0]?.type };
  const { name, type } = pickNewActivity(clientActivities, currentActivity);
  try {
    client.user?.setActivity(name, { type });
    logger.info(`Set client activity to "${name}" (${Object.values(ActivityType)[type]})`);
  } catch (error) {
    logger.error(`Error when trying to switch client activity!: error: ${error}`);
  }
};