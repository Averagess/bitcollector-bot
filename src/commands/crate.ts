import { AxiosError } from "axios";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { openCrate } from "../services/posters";
import ErrorEmbed from "../utils/ErrorEmbed";
import GenericSuccessEmbed from "../utils/GenericSuccessEmbed";

const crateCommand = {
  data: new SlashCommandBuilder()
    .setName("crate")
    .setDescription("Open a crate"),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply()
      const { data } = await openCrate(interaction.user.id)

      const { balanceReward, itemReward } = data
      const embed = GenericSuccessEmbed({title: "Crate opened!", interaction})

      embed.addFields(
        {name: "Balance rewards", value: `+${balanceReward} bits!`},
        {name: "Item rewards", value: `${itemReward.amount}x ${itemReward.name}\nwhich gave +${itemReward.cps} to your overall CPS!`}
      )

      await interaction.editReply({embeds: [embed]})
    } catch (error) {
      if(error instanceof AxiosError){
        if(!error.response) throw new Error("No response from backend")
        else if(error.response.status === 409){
          const embed = ErrorEmbed({title: "Opening crate failed :(", description: "You dont have any crates to open, you can get crates by voting the bot! check out `/vote`", interaction})
          return interaction.editReply({embeds: [embed]})
        }
        else throw new Error(`Unexpected error happened when trying to open a crate, error: ${error}`)
      }
      else throw new Error(`Unknown error happened creating an account.. Reason: ${error}`)
    }
  }
}

export default crateCommand;
