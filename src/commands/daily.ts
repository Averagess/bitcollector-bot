import { AxiosError } from "axios";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { redeemDaily } from "../services/posters";
import ErrorEmbed from "../utils/ErrorEmbed";
import GenericSuccessEmbed from "../utils/GenericSuccessEmbed";

const dailyCommand = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Redeem daily rewards"),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply()
      const { data } = await redeemDaily(interaction.user.id)

      const { balanceReward, itemReward } = data
      const dailyEmbed = GenericSuccessEmbed({ title: "Your daily rewards", interaction})
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
