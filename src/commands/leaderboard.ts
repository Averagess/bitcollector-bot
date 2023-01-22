import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import  { AxiosError } from "axios";


import { generateLeaderboard } from "../utils/imageGenerator";
import { getLeaderboard } from "../services/getters";

const leaderboardCommand = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Shows the current global leaderboard"),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply();

      const { data } = await getLeaderboard()

      if (!data.players || !data.createdAt || !data.nextUpdate)
        throw new Error("No players in leaderboard");
      
      const LeaderboardImage = await generateLeaderboard(data.players, new Date(data.createdAt), new Date(data.nextUpdate));

      await interaction.editReply({ files: [LeaderboardImage] });
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
