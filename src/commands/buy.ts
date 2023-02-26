/* eslint-disable @typescript-eslint/indent */
import { AxiosError } from "axios";
import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

import { buyItem } from "../services/posters";
import {
  GenericErrorEmbed,
  GenericSuccessEmbed,
  NoAccountEmbed,
} from "../embeds";

import intToString from "../utils/intToString";
import items from "../resources/items.json";
import { Item } from "../types";

const buyCommand = {
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Buys an item from the store")
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("The item you want to buy (name or number in the shop)")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of items you want to buy, defaults to 1")
    )
    .addBooleanOption((option) =>
      option
        .setName("max")
        .setDescription(
          "Buy the maximum amount of items you can buy with your current balance"
        )
    ),
  async autocomplete(interaction: AutocompleteInteraction) {
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const choices = items as Item[];
    const filtered = choices.filter((choice) =>
      choice.name.toLowerCase().startsWith(focusedValue)
    );
    await interaction.respond(
      filtered.map((choice) => ({
        name: `${choice.name}`,
        value: `${choice.name}`,
      }))
    );
  },

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply();

      const item = interaction.options.getString("item");
      const amount = interaction.options.getInteger("amount") || 1;
      const max = interaction.options.getBoolean("max") ?? false;

      if (!item) throw new Error("No item provided");

      const { data } = await buyItem(interaction.user.id, item, amount, max);

      const purchasedItem = data.purchasedItem;

      const resultEmbed = GenericSuccessEmbed({
        title: "Purchase successful!",
        interaction,
      });

      const descString =
        purchasedItem.amountPurchased > 1
          ? `You bought x${data.purchasedItem.amountPurchased} \`${purchasedItem.name}\`'s, and now have ${purchasedItem.amount} of them`
          : `You bought an \`${purchasedItem.name}\`, and now have ${purchasedItem.amount} of them`;

      resultEmbed.setDescription(descString);
      await interaction.editReply({ embeds: [resultEmbed] });
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.data.error === "Player not found") {
          const errorEmbed = NoAccountEmbed(interaction);
          return await interaction.editReply({ embeds: [errorEmbed] });
        } else if (error.response.data === "No such item in the shop") {
          const errorEmbed = GenericErrorEmbed({
            title: "Purchase failed!",
            description: `There is no item called "${interaction.options.getString(
              "item"
            )}" in the shop`,
            interaction,
          });
          await interaction.editReply({
            embeds: [errorEmbed],
          });
        } else if (error.response?.data.error === "not enough money") {
          const diff =
            error.response.data.itemPrice - error.response.data.balance;

          const description = `You dont have enough bits! \n\n You need ${intToString(
            diff.toString()
          )} more bits to purchase ${error.response?.data.amount} \`${
            error.response?.data.itemName
          }\``;

          const errorEmbed = GenericErrorEmbed({
            title: "Purchase failed!",
            description,
            interaction,
          });

          await interaction.editReply({ embeds: [errorEmbed] });
        }
      } else throw error;
    }
  },
};

export default buyCommand;
