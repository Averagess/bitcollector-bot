/* eslint-disable @typescript-eslint/indent */
import { AxiosError } from "axios";
import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

import { buyItem } from "../services/posters";
import ErrorEmbed from "../embeds/GenericErrorEmbed";
import GenericSuccessEmbed from "../embeds/GenericSuccessEmbed";
import intToString from "../utils/intToString";
import items from "../resources/items.json";
import { Item } from "../types";

const buyCommand = {
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Buys an item from the shop")
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
    ),
  async autocomplete(interaction: AutocompleteInteraction) {
    console.log("received autocomplete interaciton");
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const choices = items as Item[];
    const filtered = choices.filter((choice) => choice.name.toLowerCase().startsWith(focusedValue));
    await interaction.respond(filtered.map(choice => ({ name: `${choice.name}`, value: `${choice.name}` })));
  },

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply();

      const item = interaction.options.getString("item");
      const amount = interaction.options.getInteger("amount");

      const itemAmountValid = amount && amount > 0 ? amount : 1;

      if(!item) throw new Error("No item provided");

      const { data } = await buyItem(interaction.user.id, item, itemAmountValid);

      const PurchasedItem = data.purchasedItem;

      const resultEmbed = GenericSuccessEmbed({ title: "Purchase successful!", interaction });


      if (amount && amount > 1 && PurchasedItem) {
        resultEmbed.setDescription(
          `You bought ${amount} \`${PurchasedItem.name}\`'s, and now have ${PurchasedItem.amount} of them`
        );
        await interaction.editReply({ embeds: [resultEmbed] });
      } else if (PurchasedItem) {
        resultEmbed.setDescription(
          `You bought an \`${PurchasedItem.name}\`, and now have ${PurchasedItem.amount} of them`
        );
        await interaction.editReply({ embeds: [resultEmbed] });
      } else {
        resultEmbed.setDescription(`You bought an \`${item}\``);
        await interaction.editReply({ embeds: [resultEmbed] });
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.data.error === "Player not found") {
          await interaction.editReply({
            content: "You don't have an account yet! Create one with `/create`",
          });
        } else if (error.response.data === "No such item in the shop") {
          const errorEmbed = ErrorEmbed({
            title: "Purchase failed!",
            description: `There is no item called "${interaction.options.getString("item")}" in the shop`,
            interaction,
          });
          await interaction.editReply({
            embeds: [errorEmbed],
          });
        } else if (error.response.data.error === "not enough money") {
          const description = `You dont have enough bits! \n\n You need ${intToString(error.response?.data.itemPrice - error.response?.data.balance + "")} more bits to purchase ${error.response?.data.amount} \`${error.response?.data.itemName}\``;
          const errorEmbed = ErrorEmbed({
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
