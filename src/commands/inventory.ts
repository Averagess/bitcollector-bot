import { AxiosError } from "axios";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { fetchPlayerProfile } from "../services/posters";

import { GenericSuccessEmbed, NoAccountEmbed } from "../embeds";


const inventoryCommand = {
  data: new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("Shows your inventory"),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply();

      const { data }  = await fetchPlayerProfile(interaction.user.id, interaction.user.tag);

      const inventoryEmbed = GenericSuccessEmbed({ title: `${interaction.user.tag}'s inventory`, interaction })
        .addFields(
          data.inventory.map((item, index) => {
            return {
              name: `${index+1}. ${item.name}`,
              value: `Amount: ${item.amount.toString()}\nCPS: ${item.cps} bits/s`,
              inline: true,
            };
          }
          ));

      await interaction.editReply({ embeds: [inventoryEmbed]  });
    } catch (error) {
      if(error instanceof AxiosError && error.response?.status === 404){
        const errorEmbed = NoAccountEmbed(interaction);
        return await interaction.editReply({ embeds: [errorEmbed] });
      }
      else throw error;
    }
  }
};

export default inventoryCommand;