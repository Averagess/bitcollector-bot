import { AxiosError } from "axios";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { redeemDaily } from "../services/posters";
import ErrorEmbed from "../embeds/GenericErrorEmbed";
import GenericSuccessEmbed from "../embeds/GenericSuccessEmbed";

const dailyCommand = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Redeem daily rewards"),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply()
      const { data } = await redeemDaily(interaction.user.id)

      const { balanceReward } = data
      const dailyEmbed = GenericSuccessEmbed({ title: "Your daily rewards", interaction})
        .addFields({
          name: "Balance rewards",
          value: `+${balanceReward} bits!`,
        })

      await interaction.editReply({ embeds: [dailyEmbed] })
    } catch (error) {
      if(error instanceof AxiosError && error.response?.status) {
        if(error.response.status === 404) {
          const errorEmbed = ErrorEmbed({title: "Daily reward not claimed", description: "You don't have an account yet, use /create to create one", interaction})
          await interaction.editReply({ embeds: [errorEmbed] })
        }
        else if(error.response.status === 409 && error.response.data.error === "daily already redeemed"){
          const errorEmbed = ErrorEmbed({title: "Couldn't redeem daily reward", description: "You have already claimed your daily reward today", interaction})
          await interaction.editReply({embeds: [errorEmbed]})
        }
      }
      else throw error
    }
  }
}

export default dailyCommand;
