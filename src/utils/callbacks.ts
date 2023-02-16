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

import { REST, Routes } from "discord.js";
import { readdirSync } from "fs";
import { CLIENT_ID, DISCORD_TOKEN } from "./config";

export const refreshCommands = async () => {
  const commands = [];

  const commandFiles = readdirSync(__dirname + "/../commands").filter((file: string) => (file.endsWith(".ts") || file.endsWith(".js")));

  for (const file of commandFiles) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const command = require(`../commands/${file}`);
    commands.push(command.default.data.toJSON());
  }

  const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
  try {
    logger.info(`Started refreshing ${commands.length} application (/) commands.`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );
    logger.info(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    logger.error("Error raised when refreshing application (/) commands");
    logger.error(error);
  }
};

import { sendAnalytics } from "../services/posters";

export const updateAnalytics = async (client: extendedClient) => {
  logger.info("Updating analytics...");

  const guilds = await client.guilds.fetch();
  const guildAmount = guilds.size;

  let userAmount = 0;

  logger.info("Looping through guilds to get member count...");
  for(const guild of guilds.values()){
    const fetchedGuild = await guild.fetch();
    userAmount += fetchedGuild.memberCount;
  }

  logger.info("Looping through guilds to get member count... (done)");

  const analytics = {
    guildAmount,
    userAmount
  };

  logger.info("Sending analytics to backend with following data:");
  logger.info(`[guildAmount: ${guildAmount}] [userAmount: ${userAmount}]`);

  try {
    const { status } = await sendAnalytics(analytics);
    logger.info(`Successfully sent analytics to backend with status code: [${status}]`);
  } catch (error) {
    logger.error("Unhandled error occured when sending analytics to backend! Error below.");
    logger.error(error);
  }
};