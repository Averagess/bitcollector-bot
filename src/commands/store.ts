import  { AxiosError } from "axios";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { fetchPlayerShop } from "../services/posters";
import { NoAccountEmbed, ShopItemEmbed } from "../embeds";
import shopbuttons from "../actions/shopbuttons";

const storeCommand = {
  data: new SlashCommandBuilder()
    .setName("store")
    .setDescription("Shows you the store"),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply();

      const { data } = await fetchPlayerShop(interaction.user.id);

      const shopEmbed = ShopItemEmbed({
        title: "Store",
        description: "Here's the store, you can use the buttons to navigate between items.\nTo buy an item, use the /buy command.",
        indexes: [0, data.length - 1],
        item: data[0],
      });

      const buttonRow = shopbuttons(true, false);

      await interaction.editReply({ embeds: [shopEmbed], components: [buttonRow] });
    } catch (error) {
      if(error instanceof AxiosError && error.response?.status === 404) {
        const errorEmbed = NoAccountEmbed(interaction);
        return await interaction.editReply({ embeds: [errorEmbed] });
      }
      else throw error;
    }
  }
};

export default storeCommand;