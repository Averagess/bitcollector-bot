import axios, { AxiosError } from "axios";
import { ActivityType, Events } from "discord.js";
import cron from "node-cron";

import { client } from "./client";
import logger from "./utils/logger";
import { BACKEND_URL, DISCORD_TOKEN } from "./utils/config";
import clientActivities from "./clientActivities";


client.once(Events.ClientReady, (c) => {
  logger.info(`Logged in as ${c.user.tag} and ready to receive commands.`);
  logger.info("Setting initial client activity")
  const randomActivity = clientActivities[Math.floor(Math.random() * clientActivities.length)]
  client.user?.setActivity(randomActivity.name, { type: randomActivity.type })

  logger.info(`Set client activity to "${randomActivity.name}" (${Object.values(ActivityType)[randomActivity.type]})`)
})

client.on(Events.InteractionCreate, async interaction => {
  if(!interaction.isChatInputCommand()) return;

  const command = client.commands?.get(interaction.commandName);

  if(!command) return;
  const start = Date.now();

  try {
    await command.default.execute(interaction);
    const end = Date.now();
    logger.info(`Succesfully executed command [${interaction.commandName}] by ${interaction.user.tag}, took ${end - start}ms`)
  } catch (error) {
    const end = Date.now();
    if(error instanceof Error) {
      if(error.message === "No response from server") {
        logger.error(`Error raised when trying to execute command [${interaction.commandName}] by ${interaction.user.tag}. took ${end - start}ms Reason:`, error)
        await interaction.editReply({ content: 'Oops. Something went wrong. Try again later..' });
      }
    }
    else {
      logger.error(`UNKNOWN ERROR raised when trying to execute command [${interaction.commandName}] by ${interaction.user.tag}. took ${end - start} Reason:`, error)
      await interaction.editReply({ content: 'There was an error while executing this command!' });
    }
  }
})

client.on(Events.MessageCreate, async message => {
  if(message.author.bot) return;

  try {
    await axios.post(`${BACKEND_URL}/addBitToPlayer`, { discordId: message.author.id })
    logger.info(`Succesfully added bit to ${message.author.tag}`)
  } catch (error) {
    if(error instanceof AxiosError){
      if(!error.response) logger.error("No response from server when adding bit to user! Backend or DB Down?", error)
      else if(error.response.status === 404) return;
    }

    else logger.error("Unknown Error when adding bit to user!", error)
  }
})

cron.schedule('*/15 * * * *', () => {
  logger.info("Switching client activity...")
  const {name, type} = clientActivities[Math.floor(Math.random() * clientActivities.length)]
  try {
    client.user?.setActivity(name, { type })
    logger.info(`Set client activity to "${name}" (${Object.values(ActivityType)[type]})`)
  } catch (error) {
    logger.error("Error when switching client activity!", error)
  }
});

client.login(DISCORD_TOKEN);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Exiting...")
  client.destroy()
  process.exit(0)
})

process.on("SIGINT", () => {
  logger.info("SIGINT received. Exiting...")
  client.destroy()
  process.exit(0)
})