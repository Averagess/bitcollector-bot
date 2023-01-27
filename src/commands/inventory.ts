import { AxiosError } from "axios";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { fetchPlayerProfile } from "../services/posters";
import GenericSuccessEmbed from "../utils/GenericSuccessEmbed";

const inventoryCommand = {
  data: new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("Shows your inventory"),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply()
      
      const { data }  = await fetchPlayerProfile(interaction.user.id)

      const inventoryEmbed = GenericSuccessEmbed({ title: `${interaction.user.tag}'s inventory`, interaction })
        .addFields(
          data.inventory.map((item, index) => {
            return {
              name: `${index+1}. ${item.name}`,
              value: `Amount: ${item.amount.toString()}\nCPS: ${item.cps} bits/s`,
              inline: true,
            };
          }
        ))

      await interaction.editReply({ embeds: [inventoryEmbed]  });
    } catch (error) {
      if(error instanceof AxiosError && error.response?.status === 404){
        return await interaction.editReply({ content: "You don't have an account yet! Use /create to create one" });
      }
      else throw error
    }
  }
}

export default inventoryCommand;