import axios, { AxiosError } from "axios";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

import { Player } from "../types";
import ErrorEmbed from "../utils/ErrorEmbed";
import intToString from "../utils/intToString";
import logger from "../utils/logger";

const buyCommand = {
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Buy an item from the shop")
    .addStringOption((option: any) =>
      option
        .setName("item")
        .setDescription("The item you want to buy")
        .setRequired(true)
    )
    .addIntegerOption((option: any) =>
      option
        .setName("amount")
        .setDescription("The amount of items you want to buy, defaults to 1")
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const item = interaction.options.getString("item");
      const amount = interaction.options.getInteger("amount");

      const { data } = await axios.post<Player>(
        "http://localhost:3000/buyItem",
        {
          discordId: interaction.user.id,
          itemName: item,
          amount: amount ? amount : 1,
        }
      );

      const findMatchingItem = data.inventory.find(
        (inventoryItem) =>
          inventoryItem.name.toLowerCase() === item?.toLowerCase()
      );


      const resultEmbed = new EmbedBuilder()
        .setTitle("Purchase successful!")
        .setColor("#a1fc03")
        .setFooter({ text: `Requested by ${interaction.user.tag}` })
        .setTimestamp();

      if (amount && amount > 1 && findMatchingItem) {
        resultEmbed.setDescription(
          `You bought ${amount} ${findMatchingItem.name}'s, you now have ${findMatchingItem.amount} of them`
        );
        await interaction.reply({ embeds: [resultEmbed] });
      } else if (findMatchingItem) {
        resultEmbed.setDescription(
          `You bought an ${findMatchingItem.name}, you now have ${findMatchingItem.amount} of them`
        );
        await interaction.reply({ embeds: [resultEmbed] });
      } else {
        resultEmbed.setDescription(`You bought an ${item}`);
        await interaction.reply({ embeds: [resultEmbed] });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if(!error.response) throw new Error("No response from server");
        if (
          error.response.status === 404 &&
          error.response.data === "No such player"
        ) {
          await interaction.reply({
            content: "You don't have an account! Use /create to make one",
            ephemeral: true,
          });
        } else if (error.response.data === "No such item in the shop") {
          const errorEmbed = ErrorEmbed({
            title: "Purchase failed!",
            description: `There is no item called ${interaction.options.getString("item")} in the shop`,
            interaction,
          });
          await interaction.reply({
            embeds: [errorEmbed],
          });
        } else if (error.response.data.error === "not enough money") {
          const errorEmbed = ErrorEmbed({
            title:"Purchase failed!",
            description:`You dont have enough bits!\nYou need ${intToString(
              error.response?.data.itemPrice
            )} bits to purchase\n${intToString(error.response?.data.amount)} ${
              error.response.data.itemName
            }`,
            interaction}
          );

          await interaction.reply({ embeds: [errorEmbed] });
        }
      } else {
        logger.error(`unknown error happened buying item: ${error}`);
        await interaction.reply({
          content:
            "There was an error while buying the item... please try again later",
          ephemeral: true,
        });
      }
    }
  },
};

export default buyCommand;
