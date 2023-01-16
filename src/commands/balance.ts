import axios, { AxiosError } from "axios";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Player } from "../types";
import { generateBalance } from "../utils/imageGenerator";

const balanceCommand = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Replies with your current balance"),
  async execute(interaction: ChatInputCommandInteraction) {

    try {
      const { data } = await axios.post<Player>("http://localhost:3000/updatePlayer", {
        discordId: interaction.user.id,
      })

      const img = await generateBalance(data.balance, data.cps, interaction.user.username, interaction.user.displayAvatarURL({extension: "png", size: 128}))
      await interaction.reply({ files: [img] });
    } catch (error) {
      if(error instanceof AxiosError && error.response?.status === 404) {
        await interaction.reply({ content: "You don't have an account! Use /create to create one", ephemeral: true });
      }
      else {
        console.error(`error happened getting balance: ${error}`);
        await interaction.reply({ content: "There was an error while getting your balance... please try again later", ephemeral: true });
      }
    }
  }
}

export default balanceCommand;
