import { AxiosError } from "axios";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { fetchPlayerProfile } from "../services/posters";
import { generateBalance } from "../utils/imageGenerator";
import { NoAccountEmbed } from "../embeds";

const balanceCommand = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Replies with your current balance"),
  async execute(interaction: ChatInputCommandInteraction) {

    try {
      await interaction.deferReply();

      const { data } = await fetchPlayerProfile(interaction.user.id, interaction.user.tag);

      const { balance, cps } = data;
      const username = interaction.user.username;
      const avatarURL = interaction.user.displayAvatarURL({ extension: "png", size: 128 });
      const cpsString = cps.toString();

      const params = { balance, cps: cpsString, username, avatarURL };

      const img = await generateBalance(params);

      await interaction.editReply({ files: [img] });

    } catch (error) {
      if(error instanceof AxiosError && error.response?.status === 404) {
        const errorEmbed = NoAccountEmbed(interaction);
        return await interaction.editReply({ embeds: [errorEmbed] });
      }
      else throw error;
    }
  }
};

export default balanceCommand;
