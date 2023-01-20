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
    .setDescription("Tells your stats"),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply();
      
      const player = await axios.post<Player>(
        "http://localhost:3000/updatePlayer",
        { discordId: interaction.user.id }
      );

      const statsEmbed = new EmbedBuilder()
        .setTitle(`${interaction.user.tag}'s stats`)
        .addFields(
          { name: "💰Balance", value: intToString(player.data.balance), inline: true },
          { name: "🕓CPS", value: `${player.data.cps.toString()} bits/s`, inline: true },
          { name: "📆Account created", value: new Date(player.data.createdAt).toLocaleDateString(), inline: true },
        )
        .setThumbnail(interaction.user.displayAvatarURL())
        .setColor("#ebc034")
        .setFooter({ text: `Requested by ${interaction.user.tag}` })
        .setTimestamp();
      
      await interaction.editReply({ embeds: [statsEmbed] })
    } catch (error) {
      if(error instanceof AxiosError) {
        if(!error.response) throw new Error("No response from server")
        else if(error.response.status === 404) return await interaction.editReply({ content: "You don't have an account yet! Use /start to create one" });
        else throw new Error(`Unknown axios error raised when trying to fetch stats.. error: ${error}`);
      }
      else {
        throw new Error(`Unknown error raised when trying to fetch stats.. error: ${error}`);
      }
    }
  },
};

export default statsCommand;
