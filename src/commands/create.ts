import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import  { AxiosError } from "axios";

import ErrorEmbed from "../utils/ErrorEmbed";
import GenericSuccessEmbed from "../utils/GenericSuccessEmbed";
import { createAccount } from "../services/posters";

const createCommand = {
  data: new SlashCommandBuilder()
    .setName("create")
    .setDescription("Creates an account for you"),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply();

      const { status } = await createAccount(interaction.user.id, interaction.user.tag);
      
      if (status === 200) {
        const successEmbed = GenericSuccessEmbed({ title: "Account created successfully!", interaction })
          .setDescription("Next step is to use check out /store and then /buy to buy your first item!");
        
        await interaction.editReply({ embeds: [successEmbed] });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if(!error.response) throw new Error("No response from server");
        else if(error.response.status === 409){
          const errorEmbed = ErrorEmbed({ title: "Account creation cancelled!", description: "You already have an account!", interaction: interaction })
          await interaction.editReply({ embeds: [errorEmbed] });
        }
        else throw new Error(`Unknown AxiosError raised creating an account.. Reason: ${error}`)
      }
      else {
        throw new Error(`Unknown error happened creating an account.. Reason: ${error}`)
      }
    }
  },
};

export default createCommand;
