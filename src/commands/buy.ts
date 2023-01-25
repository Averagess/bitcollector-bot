import { AxiosError } from "axios";
import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

import { buyItem } from "../services/posters";
import ErrorEmbed from "../utils/ErrorEmbed";
import GenericSuccessEmbed from "../utils/GenericSuccessEmbed";
import intToString from "../utils/intToString";

const buyCommand = {
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Buys an item from the shop")
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("The item you want to buy (Name or ID)")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of items you want to buy, defaults to 1")
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply();

      const item = interaction.options.getString("item");
      const amount = interaction.options.getInteger("amount");

      const itemAmountValid = amount && amount > 0 ? amount : 1;
      
      if(!item) throw new Error("No item provided");

      const { data } = await buyItem(interaction.user.id, item, itemAmountValid)

      const PurchasedItem = data.purchasedItem;

      const resultEmbed = GenericSuccessEmbed({ title: "Purchase successful!", interaction })
        

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
      if (error instanceof AxiosError) {
        if (!error.response) throw new Error("No response from server");
        if (error.response.data.error === "Player not found") {
          await interaction.editReply({
            content: "You don't have an account! Use /create to make one",
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
          const errorEmbed = ErrorEmbed({
            title: "Purchase failed!",
            description: `You dont have enough bits!
            \nYou currently have: ${
              error.response.data.balance
            } bits but,\nYou need ${intToString(
              error.response?.data.itemPrice
            )} bits to purchase\n\`${intToString(error.response?.data.amount)} ${
              error.response.data.itemName
            }\``,
            interaction,
          });

          await interaction.editReply({ embeds: [errorEmbed] });
        }
      } else {
        throw new Error(`unknown error happened buying item: ${error}`);
      }
    }
  },
};

export default buyCommand;
