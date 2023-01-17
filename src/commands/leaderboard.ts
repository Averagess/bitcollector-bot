import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import axios, { AxiosError } from "axios";
import { LeaderboardItem } from "../types";

const leaderboardCommand = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Replies with the global leaderboard"),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply();
      
      const leaderboard = await axios.get<LeaderboardItem[]>(
        "http://localhost:3000/leaderboard"
      );
      const leaderboardEmbed = new EmbedBuilder()
        .setTitle("Global Leaderboard")
        .addFields(
          leaderboard.data.map((item, index) => {
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
        .setFooter({ text: `Requested by ${interaction.user.tag}` })
        .setTimestamp();

      await interaction.editReply({ embeds: [leaderboardEmbed] });
    } catch (error) {
      if(error instanceof AxiosError && !error.response) throw new Error("No response from server")
      else throw new Error(`There was an unknown error while getting the leaderboard, error: ${error}`)
    }
  },
};

export default leaderboardCommand;
