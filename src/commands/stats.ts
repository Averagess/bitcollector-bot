import { AxiosError } from "axios";
import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { fetchPlayerProfile } from "../services/posters";
import { calcMinutesAfterDate } from "../utils/calcMinutesHelper";
import GenericSuccessEmbed from "../embeds/GenericSuccessEmbed";
import intToString from "../utils/intToString";
import nextDailyStringGenerator from "../utils/nextDailyGenerator";

const statsCommand = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Tells your stats"),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply();
      
      const player = await fetchPlayerProfile(interaction.user.id, interaction.user.tag)
      
      const hoursSinceDailyRedeem = player.data.lastDaily ? Math.floor(calcMinutesAfterDate(new Date(player.data.lastDaily)) / 60) : 0;
      
      const dailyRedeemed = hoursSinceDailyRedeem < 24 ? "yes" : "no";

      const nextDailyString = hoursSinceDailyRedeem ? nextDailyStringGenerator(new Date(player.data.lastDaily)) : "now"
      const statsEmbed = GenericSuccessEmbed({ title: `${interaction.user.tag}'s stats`, interaction })
        .addFields(
          { name: "💰Balance", value: intToString(player.data.balance), inline: true },
          { name: "🕓CPS", value: `${player.data.cps.toString()} bits/s`, inline: true },
          { name: "📆Account created", value: new Date(player.data.createdAt).toUTCString(), inline: true },
          { name: "📅Daily redeemed", value: dailyRedeemed, inline: true },
          { name: "Next daily", value: nextDailyString, inline: true },
          { name: "Daily count", value: player.data.dailyCount.toString(), inline: true},
          { name: "📦Unopened crates", value: `${player.data.unopenedCrates} crates`, inline: true},
          { name: "Crates opened", value: `${player.data.openedCrates} crates`, inline: true},
        )
        .setThumbnail(interaction.user.displayAvatarURL())
      
      await interaction.editReply({ embeds: [statsEmbed] })
    } catch (error) {
      if(error instanceof AxiosError && error.response?.status === 404) {
        return await interaction.editReply({ content: "You don't have an account yet! Use /create to create one" });
      }
      else throw error
    }
  },
};

export default statsCommand;
