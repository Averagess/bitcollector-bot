import { ActionRowBuilder, ButtonBuilder,  ButtonStyle, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { AxiosError } from "axios";

import logger from "../utils/logger";
import { resetPlayer } from "../services/posters";
import { GenericErrorEmbed, GenericSuccessEmbed, NoAccountEmbed } from "../embeds";

const resetCommand = {
  data: new SlashCommandBuilder()
    .setName("reset")
    .setDescription("Resets your account"),
  async execute(interaction: ChatInputCommandInteraction) {

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("resetConfirm")
          .setLabel("RESET")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("resetCancel")
          .setLabel("CANCEL")
          .setStyle(ButtonStyle.Secondary),
      );

    const confirmEmbed = GenericSuccessEmbed({
      title: "Account reset confirmation",
      description: "This command will reset your account, and you will start from square one. Are you sure you want to reset your account?",
      color: "DarkOrange",
      footer: "This confirmation will expire in 20 seconds.",
      tip: false,
      interaction
    });

    const msg = await interaction.reply({ embeds: [confirmEmbed], components: [row] });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter = (i: any) => i.user.id === interaction.user.id;

    msg.awaitMessageComponent({ filter, time: 20000 })
      .then(buttonInteraction => {
        if(buttonInteraction.customId === "resetConfirm") {
          resetPlayer(interaction.user.id)
            .then(() => {
              const successEmbed = GenericSuccessEmbed({ title: "Your account has been reset.", description: "Account has been reset successfully. You are back to square one.", interaction });
              interaction.editReply({ embeds: [successEmbed], components: [] });
            })
            .catch(error => {
              if(error instanceof AxiosError && error.response?.status === 404) {
                const embed = NoAccountEmbed(interaction);
                return interaction.editReply({ embeds: [embed], components: [] });
              }

              logger.info(`error when trying to reset account, error: ${error}`);
              const errorEmbed = GenericErrorEmbed({ title: "Something went wrong..", description: "I couldnt reset your account.. Try again later.", interaction });
              interaction.editReply({ embeds: [errorEmbed], components: [] });
            });
        } else {
          const cancelledEmbed = GenericSuccessEmbed({ title: "Account reset cancelled.", description: "You cancelled the account reset.", interaction });
          interaction.editReply({ embeds: [cancelledEmbed], components: [] });
        }
      })
      .catch(() => {
        const cancelledEmbed = GenericSuccessEmbed({ title: "Account reset cancelled.", description: "Account reset confirmation elapsed wait time, reset request cancelled.", interaction });
        interaction.editReply({ embeds: [cancelledEmbed], components: [] });
      });
  }
};

export default resetCommand;