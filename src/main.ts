import axios, { AxiosError } from "axios";
import { Events } from "discord.js";

import config from "./utils/config";

import { client } from "./client";
import logger from "./utils/logger";

client.once(Events.ClientReady, (c) => {
  logger.info(`Logged in as ${c.user.tag} and ready to receive commands.`);
})

client.on(Events.InteractionCreate, async interaction => {
  if(!interaction.isChatInputCommand()) return;
  const command = client.commands?.get(interaction.commandName);

  if(!command) return;

  try {
    await command.default.execute(interaction);
    logger.info(`Succesfully executed command [${interaction.commandName}] by ${interaction.user.tag}`)
  } catch (error) {
    if(error instanceof Error) {
      if(error.message === "No response from server") {
        logger.error(`Error raised when trying to execute command [${interaction.commandName}] by ${interaction.user.tag}. Reason:`, error)
        await interaction.reply({ content: 'Oops. Something went wrong. Try again later..', ephemeral: true });
      }
    }
    else {
      logger.error(`UNKNOWN ERROR raised when trying to execute command [${interaction.commandName}] by ${interaction.user.tag}. Reason:`, error)
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
})

client.on(Events.MessageCreate, async message => {
  if(message.author.bot) return;

  try {
    await axios.post("http://localhost:3000/addBitToPlayer", { discordId: message.author.id })
    logger.info(`Succesfully added bit to ${message.author.tag}`)
  } catch (error) {
    if(error instanceof AxiosError){
      if(!error.response) logger.error("No response from server when adding bit to user! Backend or DB Down?", error)
      else if(error.response.status === 404) return;
    }

    else logger.error("Unknown Error when adding bit to user!", error)
  }
})

client.login(config.DISCORD_TOKEN);