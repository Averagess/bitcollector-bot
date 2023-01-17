import axios, { AxiosError } from "axios";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

import { PurchaseResponse } from "../types";
import ErrorEmbed from "../utils/ErrorEmbed";
import intToString from "../utils/intToString";

const buyCommand = {
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Buy an item from the shop")
    .addStringOption((option: any) =>
      option
        .setName("item")
        .setDescription("The item you want to buy (Name or ID)")
        .setRequired(true)
    )
    .addIntegerOption((option: any) =>
      option
        .setName("amount")
        .setDescription("The amount of items you want to buy, defaults to 1")
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply();

      const item = interaction.options.getString("item");
      const amount = interaction.options.getInteger("amount");


      const { data } = await axios.post<PurchaseResponse>(
        "http://localhost:3000/buyItem",
        {
          discordId: interaction.user.id,
          itemName: item,
          amount: amount ? amount : 1,
        }
      );

      const PurchasedItem = data.purchasedItem;

      const resultEmbed = new EmbedBuilder()
        .setTitle("Purchase successful!")
        .setColor("#a1fc03")
        .setFooter({ text: `Requested by ${interaction.user.tag}` })
        .setTimestamp();

      if (amount && amount > 1 && PurchasedItem) {
        resultEmbed.setDescription(
          `You bought ${amount} ${PurchasedItem.name}'s, you now have ${PurchasedItem.amount} of them`
        );
        await interaction.editReply({ embeds: [resultEmbed] });
      } else if (PurchasedItem) {
        resultEmbed.setDescription(
          `You bought an ${PurchasedItem.name}, you now have ${PurchasedItem.amount} of them`
        );
        await interaction.editReply({ embeds: [resultEmbed] });
      } else {
        resultEmbed.setDescription(`You bought an ${item}`);
        await interaction.editReply({ embeds: [resultEmbed] });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (!error.response) throw new Error("No response from server");
        if (error.response.data === "No such player") {
          await interaction.reply({
            content: "You don't have an account! Use /create to make one",
            ephemeral: true,
          });
        } else if (error.response.data === "No such item in the shop") {
          const errorEmbed = ErrorEmbed({
            title: "Purchase failed!",
            description: `There is no item called ""${interaction.options.getString(
              "item"
            )}" in the shop`,
            interaction,
          });
          await interaction.reply({
            embeds: [errorEmbed],
          });
        } else if (error.response.data.error === "not enough money") {
          const errorEmbed = ErrorEmbed({
            title: "Purchase failed!",
            description: `You dont have enough bits!\nYou need ${intToString(
              error.response?.data.itemPrice
            )} bits to purchase\n${intToString(error.response?.data.amount)} ${
              error.response.data.itemName
            }`,
            interaction,
          });

          await interaction.reply({ embeds: [errorEmbed] });
        }
      } else {
        throw new Error(`unknown error happened buying item: ${error}`);
      }
    }
  },
};

export default buyCommand;
