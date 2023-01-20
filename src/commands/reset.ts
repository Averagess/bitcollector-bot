import { ActionRowBuilder, ButtonBuilder,  ButtonStyle, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import axios, { AxiosError } from "axios";

import logger from "../utils/logger";

const resetCommand = {
  data: new SlashCommandBuilder()
    .setName("reset")
    .setDescription("Resets your account"),
  async execute(interaction: ChatInputCommandInteraction) {

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('resetConfirm')
          .setLabel('RESET')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('resetCancel')
          .setLabel('CANCEL')
          .setStyle(ButtonStyle.Secondary),
      );

    const msg = await interaction.reply({content: "This command will reset your account, and you will start from square one. Are you sure you want to reset your account?", components: [row]})
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter = (i: any) => i.user.id === interaction.user.id;

      msg.awaitMessageComponent( { filter, time: 20000 } )
        .then(buttonInteraction => {
          if(buttonInteraction.customId === "resetConfirm") {
            axios.post("http://localhost:3000/resetPlayer", { discordId: interaction.user.id } )
              .then(() => {
              interaction.editReply({content: "Account has been reset successfully. You are back to square one.", components: [] })
              })
              .catch(error => {
                if(error instanceof AxiosError && error.response?.data.error === "player not found") {
                  return interaction.editReply({content: "You dont have an account yet. Create one with /create", components: [] })
                }

                logger.info(`error when trying to reset account, error: ${error}`)
                interaction.editReply({content: "Oops. I couldnt reset your account.. Try again later.", components: [] })
              })
          } else {
            interaction.editReply({content: "You cancelled the account reset.", components: [] })
          }
        })
        .catch(() => {
          interaction.editReply({content: "Account reset confirmation elapsed wait time, reset request cancelled.", components: [] })
        })
  }
}

export default resetCommand;