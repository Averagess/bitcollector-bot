import axios from "axios";
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { InventoryItem } from "../types";

const storeCommand = {
  data: new SlashCommandBuilder()
    .setName("store")
    .setDescription("Replies with an store page!"),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const { data } = await axios.post<InventoryItem[]>("http://localhost:3000/getShopForPlayer", {
        discordId: interaction.user.id,
      });

      const shopEmbed = new EmbedBuilder()
        .setTitle("Store")
        .addFields(
          data.map((item, index) => {
            const priceReadable = item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return {
              value: `**Price:** ${priceReadable} bits\n**CPS:** ${item.cps}\n**You own:** ${item.amount}`,
              name: `${index + 1}. ${item.name}`,
            };
          })
        )
        .setColor("#ebc034")
        .setFooter({ text: `Requested by ${interaction.user.tag}` })
        .setTimestamp();

      interaction.reply({ embeds: [shopEmbed] });
    } catch (error) {
      console.error(`error happened getting store: ${error}`);
      await interaction.reply({ content: "There was an error while getting the store... please try again later", ephemeral: true });
    }
  }
}

export default storeCommand;