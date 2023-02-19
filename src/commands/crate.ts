import { AxiosError } from "axios";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { openCrate } from "../services/posters";
import { GenericErrorEmbed, GenericSuccessEmbed, NoAccountEmbed } from "../embeds";

const crateCommand = {
  data: new SlashCommandBuilder()
    .setName("crate")
    .setDescription("Opens a crate"),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply();
      const { data } = await openCrate(interaction.user.id);

      const { balanceReward, itemReward } = data;
      const embed = GenericSuccessEmbed({ title: "✨ Crate opened! 🎇", interaction });

      embed.addFields(
        { name: "💰 Balance rewards", value: `+${balanceReward} bits!` },
        { name: "💻 Item rewards", value: `${itemReward.amount}x ${itemReward.name}\nwhich gave +${itemReward.cps} to your overall CPS!` }
      );

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      if(error instanceof AxiosError && error.response?.status === 409){
        const embed = GenericErrorEmbed({ title: "Opening crate failed :(", description: "You dont have any crates to open, you can get crates by voting the bot! check out `/vote`", interaction });
        return await interaction.editReply({ embeds: [embed] });
      }
      if(error instanceof AxiosError&& error.response?.status === 404) {
        const embed = NoAccountEmbed(interaction);
        return await interaction.editReply({ embeds: [embed] });
      }
      else throw error;
    }
  }
};

export default crateCommand;
