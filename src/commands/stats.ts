import axios, { AxiosError } from "axios";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Player } from "../types";
import intToString from "../utils/intToString";

const statsCommand = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Replies with your stats"),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const player = await axios.post<Player>(
        "http://localhost:3000/updatePlayer",
        { discordId: interaction.user.id }
      );

      const statsEmbed = new EmbedBuilder()
        .setTitle(`${interaction.user.tag}'s stats`)
        .addFields(
          { name: "💰Balance", value: intToString(player.data.balance), inline: true },
          { name: "🕓CPS", value: `${player.data.cps.toString()} Bits/s`, inline: true },
          { name: "📆Account created", value: new Date(player.data.createdAt).toLocaleDateString(), inline: true },
        )
        .setThumbnail(interaction.user.displayAvatarURL())
        .setColor("#ebc034")
        .setFooter({ text: `Requested by ${interaction.user.tag}` })
        .setTimestamp();
      await interaction.reply({ embeds: [statsEmbed] })
    } catch (error) {
      console.error(`error happened getting stats: ${error}`);
      if(error instanceof AxiosError && error.response?.status === 404) {
        await interaction.reply({ content: "You don't have an account yet! Use /start to create one", ephemeral: true });
      }
    }
  },
};

export default statsCommand;
