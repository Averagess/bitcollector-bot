import { AxiosError } from "axios";
import {
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

import { buyItem, fetchPlayerShop } from "../services/posters";
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
        description: "Here's the store, you can use the buttons to navigate between items.\nTo buy an items in bulk, use the `/buy [item name]` command.\nThis session will automatically close in 15 minutes, to open a new session use the /store command again.",
        indexes: [0, data.length - 1],
        item: data[0],
        sessionOwnerTag: interaction.user.tag,
      });

      const buttonRow = shopbuttons(true, false, false);

      const message = await interaction.editReply({
        embeds: [shopEmbed],
        components: [buttonRow],
      });

      const collector = message.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 875000, // About 14.5 minutes
      });

      collector.on("collect", async (i) => {
        if (i.user.id !== interaction.user.id) return;
        else if (
          i.message.embeds.length === 0 ||
          i.message.embeds[0].title === null
        )
          return; // Prevents bot crashing if the embed has been deleted
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

          const buttonRow = shopbuttons(currItemIsFirst, false, currItemIsLast);

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

          const buttonRow = shopbuttons(currItemIsFirst, false, currItemIsLast);
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

          const buttonRow = shopbuttons(true, false, false);

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

          const buttonRow = shopbuttons(false, false, true);

          await interaction.editReply({
            embeds: [embed],
            components: [buttonRow],
          });
        } else if (i.customId === "buyCurrentItem") {
          try {
            const response = await buyItem(i.user.id, `${curr + 1}`, 1, false);
            console.log(response.data);
            // nasty but hey it works
            response.data.purchasedItem.cps = response.data.purchasedItem.baseCps;
            const newEmbed = ShopItemEmbed({
              indexes: [curr, max],
              item: response.data.purchasedItem,
              sessionOwnerTag: interaction.user.tag,
            });

            const buttonRow = shopbuttons(
              currItemIsFirst,
              false,
              currItemIsLast
            );

            await interaction.editReply({
              embeds: [newEmbed],
              components: [buttonRow],
            });
          } catch (error) {
            console.log("error buying item", error);
            // Implement error handling
            // We could edit the existing message embed to display errors like not enough money etc.
            const target = i.user.id;
            let message = `<@${target}> I couldn't complete your transaction.\nReason: `;

            if(error instanceof AxiosError && error.response?.status === 400){
              message += "You don't have enough bits to buy this item.";
            } else {
              message += "An unknown error occured. Please try again later.";
            }

            await interaction.followUp({ content: message, ephemeral: true });
          }
        }
      });
      collector.on("end", async () => {
        const buttonRow = shopbuttons(true, false, true);
        const shopEmbed = new EmbedBuilder()
          .setTitle("This store session was closed automatically.")
          .setDescription(
            "Store session has been closed. to open a new session, please use the /store command"
          );

        await interaction.editReply({
          embeds: [shopEmbed],
          components: [buttonRow],
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
