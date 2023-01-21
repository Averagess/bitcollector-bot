import axios, { AxiosError } from "axios";
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

import { RedeemDailyResponse } from "../types";
import { BACKEND_URL } from "../utils/config";
import ErrorEmbed from "../utils/ErrorEmbed";

const dailyCommand = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Redeem daily rewards"),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply()
      const { data } = await axios.post<RedeemDailyResponse>(`${BACKEND_URL}/redeemDaily`,{
        discordId: interaction.user.id
      })

      const { balanceReward, itemReward } = data
      const dailyEmbed = new EmbedBuilder()
        .setTitle("Your daily rewards")
        .setColor("#a1fc03")
        .setFooter({ text: `Requested by ${interaction.user.tag}` })
        .setTimestamp()
        .addFields({
          name: "Balance rewards",
          value: `${balanceReward} bits`,
        })

      if(itemReward.amount && itemReward.cps && itemReward.name) dailyEmbed.addFields({ name: "Item rewards", value: `${itemReward.amount} x ${itemReward.name}\nwhich gave +${itemReward.cps} to your overall CPS!` })
      else dailyEmbed.addFields({ name: "Item rewards", value: "none :(" })
      await interaction.editReply({ embeds: [dailyEmbed] })
    } catch (error) {
      if(error instanceof AxiosError) {
        if(!error.response) throw new Error("No response from server")
        else if(error.response.status === 404) {
          const errorEmbed = ErrorEmbed({title: "Daily reward not claimed", description: "You don't have an account yet, use /create to create one", interaction})
          await interaction.editReply({ embeds: [errorEmbed] })
        }
        else if(error.response.status === 409 && error.response.data.error === "daily already redeemed"){
          const errorEmbed = ErrorEmbed({title: "Couldn't redeem daily reward", description: "You have already claimed your daily reward today", interaction})
          await interaction.editReply({embeds: [errorEmbed]})
        }
        else throw new Error(error.response.data.error)
      }
      else throw new Error(`Unknown Error, when redeeming daily rewards, error: ${error}`)
    }
  }
}

export default dailyCommand;
