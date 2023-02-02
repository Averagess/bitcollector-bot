import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { AxiosError } from "axios";

import ErrorEmbed from "../embeds/GenericErrorEmbed";
import GenericSuccessEmbed from "../embeds/GenericSuccessEmbed";
import { createAccount } from "../services/posters";

const createCommand = {
  data: new SlashCommandBuilder()
    .setName("create")
    .setDescription("Creates an account for you"),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply();

      const { status } = await createAccount(
        interaction.user.id,
        interaction.user.tag
      );

      if (status === 200) {
        const successEmbed = GenericSuccessEmbed({
          title: "Account created successfully!",
          interaction,
        }).setDescription(
          "Next step is to check out /store and then /buy to buy your first item!"
        );

        await interaction.editReply({ embeds: [successEmbed] });
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        const errorEmbed = ErrorEmbed({
          title: "Account creation cancelled!",
          description: "You already have an account!",
          interaction: interaction,
        });
        await interaction.editReply({ embeds: [errorEmbed] });
      } else throw error;
    }
  },
};

export default createCommand;
