import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import axios from "axios";
import { LeaderboardItem } from "../types";


const pingCommand = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Replies with an TOP 10 Global leaderboard"),
    
  async execute(interaction: ChatInputCommandInteraction) {
    const leaderboard = await axios.get<LeaderboardItem[]>(
      "http://localhost:3000/leaderboard"
    );

    const leaderboardEmbed = new EmbedBuilder()
      .setTitle("Global Leaderboard")
      .addFields(
        leaderboard.data.map((item, index) => {
          const balanceReadable = item.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return {
            value: `**Balance:** ${balanceReadable} bits\n**CPS:** ${item.cps}`,
            name: `${index + 1}. ${item.discordDisplayName}`,
          };
        })
      )
      .setColor("#ebc034")
      .setFooter({ text: `Requested by ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [leaderboardEmbed] });
  },
};

export default pingCommand;
