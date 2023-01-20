import axios, { AxiosError } from "axios";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { Player } from "../types";
import config from "../utils/config";
import { generateBalance } from "../utils/imageGenerator";

const balanceCommand = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Replies with your current balance"),
  async execute(interaction: ChatInputCommandInteraction) {

    try {
      await interaction.deferReply();
      
      const { data } = await axios.post<Player>(`${config.BACKEND_URL}/updatePlayer`, {
        discordId: interaction.user.id,
      })

      const { balance, cps} = data
      const username = interaction.user.username
      const avatarURL = interaction.user.displayAvatarURL({extension: "png", size: 128})
      const cpsString = cps.toString()

      const params = { balance, cps: cpsString, username, avatarURL}

      const img = await generateBalance(params)

      await interaction.editReply({ files: [img] });
      
    } catch (error) {
      if(error instanceof AxiosError) {
        if(!error.response) {
          throw new Error("No response from server");
        }
        else if(error.response.status === 404) {
          await interaction.editReply({ content: "You don't have an account! Use /create to create one"  });
        }

      }
      else {
        throw new Error("Unknown error raised when trying to fetch balance. Error: ${error}");
      }
    }
  }
}

export default balanceCommand;
