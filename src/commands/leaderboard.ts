import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { generateLeaderboard } from "../utils/imageGenerator";
import { getLeaderboard } from "../services/getters";

const leaderboardCommand = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Shows the current global leaderboard"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const { data } = await getLeaderboard();

    if (!data.players || !data.createdAt || !data.nextUpdate)
      throw new Error("No players in leaderboard");

    const Params = {
      players: data.players,
      createdAt: new Date(data.createdAt),
      nextUpdate: new Date(data.nextUpdate),
    };

    const LeaderboardImage = await generateLeaderboard(Params);

    await interaction.editReply({ files: [LeaderboardImage] });
  },
};

export default leaderboardCommand;
