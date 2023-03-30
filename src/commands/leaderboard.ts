import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { getLeaderboard } from "../services/getters";

const leaderboardCommand = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Shows the current global leaderboard"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const { data } = await getLeaderboard();
    const LeaderboardImage = Buffer.from(data.bufferB64, "base64");

    await interaction.editReply({ files: [LeaderboardImage] });
  },
};

export default leaderboardCommand;
