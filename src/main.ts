import { Events } from "discord.js";

import config from "./utils/config";

import { client } from "./client";
import axios, { AxiosError } from "axios";

client.once(Events.ClientReady, (c) => {
  console.log(`Logged in as ${c.user.tag}!`);
})

client.on(Events.InteractionCreate, async interaction => {
  if(!interaction.isChatInputCommand()) return;
  const command = client.commands?.get(interaction.commandName);

  if(!command) return;

  try {
    await command.default.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
})

client.on(Events.MessageCreate, async message => {
  if(message.author.bot) return;
  try {
    await axios.post("http://localhost:3000/addBitToPlayer", { discordId: message.author.id })
    console.log(`Succesfully added bit to ${message.author.tag}`)
  } catch (error) {
    if(error instanceof AxiosError && error.response?.status === 404) return;
    else console.error("Error while adding bit", error)
  }
})

client.login(config.DISCORD_TOKEN);