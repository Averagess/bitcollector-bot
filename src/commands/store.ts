import axios, { AxiosError } from "axios";
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { InventoryItem } from "../types";

const storeCommand = {
  data: new SlashCommandBuilder()
    .setName("store")
    .setDescription("Shows you the store"),
    
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply();

      const { data } = await axios.post<InventoryItem[]>("http://localhost:3000/getShopForPlayer", {
        discordId: interaction.user.id,
      });

      const shopEmbed = new EmbedBuilder()
        .setTitle("Store")
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
        .setColor("#ebc034")
        .setFooter({ text: `Requested by ${interaction.user.tag}` })
        .setTimestamp();

      await interaction.editReply({ embeds: [shopEmbed] });
    } catch (error) {
      if(error instanceof AxiosError) {
        if(!error.response) throw new Error("No response from server")
        else if(error.response.status === 404) await interaction.editReply({ content: "You don't have an account yet! Please create one with /create" })
        else throw new Error(`There was an unknown AxiosError error while getting the store, error: ${error}`)
      }
      else throw new Error(`There was an unknown error while getting the store, error: ${error}`)
    }
  }
}

export default storeCommand;