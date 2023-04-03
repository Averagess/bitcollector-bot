import { AxiosError } from "axios";
import {
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

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
        description:
          "Here's the store, you can use the buttons to navigate between items.\nTo buy an item, use the `/buy [item name]` command.\nThis session will automatically close in 15 minutes, to open a new session use the /store command again.",
        indexes: [0, data.length - 1],
        item: data[0],
        sessionOwnerTag: interaction.user.tag,
      });

      const buttonRow = shopbuttons(true, false);

      const message = await interaction.editReply({
        embeds: [shopEmbed],
        components: [buttonRow],
      });

      const collector = message.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 900000, // 15 minutes
      });

      collector.on("collect", async (i) => {
        if (i.user.id !== interaction.user.id) return;
        await i.deferUpdate();

        const matchCurrI = i.message.embeds[0].title?.match(/\((\d+)\/\d+\)/);
        const matchMaxI = i.message.embeds[0].title?.match(/\(\d+\/(\d+)\)/);
        if (!matchCurrI || !matchMaxI) return;

        const curr = Number(matchCurrI[1]) - 1;
        const max = Number(matchMaxI[1]) - 1;

        const currItemIsFirst = !(curr + 1 > 0);
        const currItemIsLast = !(curr + 1 < max);

        const { data } = await fetchPlayerShop(i.user.id);

        if (i.customId === "nextShopItem") {
          if (curr === max) return;

          // Update embed with the next item
          const embed = ShopItemEmbed({
            indexes: [curr + 1, max],
            item: data[curr + 1],
            sessionOwnerTag: interaction.user.tag,
          });

          const buttonRow = shopbuttons(currItemIsFirst, currItemIsLast);

          await interaction.editReply({
            embeds: [embed],
            components: [buttonRow],
          });
        } else if (i.customId === "previousShopItem") {
          if (curr === 0) return;

          // Update embed with the previous item
          const embed = ShopItemEmbed({
            indexes: [curr - 1, max],
            item: data[curr - 1],
            sessionOwnerTag: interaction.user.tag,
          });

          const buttonRow = shopbuttons(currItemIsFirst, currItemIsLast);
          await interaction.editReply({
            embeds: [embed],
            components: [buttonRow],
          });
        } else if (i.customId === "toFirstShopItem") {
          const embed = ShopItemEmbed({
            indexes: [0, max],
            item: data[0],
            sessionOwnerTag: interaction.user.tag,
          });

          const buttonRow = shopbuttons(true, false);

          await interaction.editReply({
            embeds: [embed],
            components: [buttonRow],
          });
        } else if (i.customId === "toLastShopItem") {
          const embed = ShopItemEmbed({
            indexes: [max, max],
            item: data[max],
            sessionOwnerTag: interaction.user.tag,
          });

          const buttonRow = shopbuttons(false, true);

          await interaction.editReply({
            embeds: [embed],
            components: [buttonRow],
          });
        }
      });
      collector.on("end", async () => {
        const buttonRow = shopbuttons(true, true);
        const shopEmbed = new EmbedBuilder()
          .setTitle("Store session over.")
          .setDescription("store session has been closed, to open a new session use the /store command");

        await interaction.editReply({
          embeds: [shopEmbed],
          components: [buttonRow]
        });
      });
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        const errorEmbed = NoAccountEmbed(interaction);
        return await interaction.editReply({ embeds: [errorEmbed] });
      } else throw error;
    }
  },
};

export default storeCommand;
