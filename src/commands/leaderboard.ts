import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import axios, { AxiosError } from "axios";

import { Leaderboard } from "../types";
import {
  calcMinutesAfterDate,
  calcMinutesToDate,
} from "../utils/calcMinutesHelper";
import config from "../utils/config";

const leaderboardCommand = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Shows the current global leaderboard"),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply();

      const { data } = await axios.get<Leaderboard>(
        `${config.BACKEND_URL}/leaderboard`
      );

      if (!data.players || !data.createdAt || !data.nextUpdate)
        throw new Error("No players in leaderboard");

      const leaderboardEmbed = new EmbedBuilder()
        .setTitle("Global Leaderboard")
        .addFields(
          data.players.map((item, index) => {
            const balanceReadable = item.balance.replace(
              /\B(?=(\d{3})+(?!\d))/g,
              ","
            );
            return {
              name: `${index + 1}. ${item.discordDisplayName}`,
              value: `💰**Balance:** ${balanceReadable} bits\n🕓**CPS:** ${item.cps} bits/s`,
            };
          })
        )
        .setColor("#ebc034")
        .setFooter({
          text: `Leaderboard updated: ${calcMinutesAfterDate(
            new Date(data.createdAt)
          )} minutes ago, next update in: ${calcMinutesToDate(
            new Date(),
            new Date(data.nextUpdate)
          )} minutes`,
        });

      await interaction.editReply({ embeds: [leaderboardEmbed] });
    } catch (error) {
      if (error instanceof AxiosError && !error.response)
        throw new Error("No response from server");
      else
        throw new Error(
          `There was an unknown error while getting the leaderboard, error: ${error}`
        );
    }
  },
};

export default leaderboardCommand;
