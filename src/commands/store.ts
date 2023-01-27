import  { AxiosError } from "axios";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { fetchPlayerShop } from "../services/posters";
import GenericSuccessEmbed from "../utils/GenericSuccessEmbed";

const storeCommand = {
  data: new SlashCommandBuilder()
    .setName("store")
    .setDescription("Shows you the store"),
    
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply();

      const { data } = await fetchPlayerShop(interaction.user.id);

      const shopEmbed = GenericSuccessEmbed({ title: "Store", interaction })
        .addFields(
          data.map((item, index) => {
            const priceReadable = item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            const cpsReadable = item.cps.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            return {
              name: `${index + 1}. ${item.name}`,
              value: `**Price:** ${priceReadable} bits\n**CPS:** ${cpsReadable} bits/s\n**You own:** ${item.amount}`,
            };
          })
        )

      await interaction.editReply({ embeds: [shopEmbed] });
    } catch (error) {
      if(error instanceof AxiosError && error.response?.status === 404) {
      await interaction.editReply({ content: "You don't have an account yet! Please create one with /create" })
      }
      else throw error
    }
  }
}

export default storeCommand;