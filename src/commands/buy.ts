import axios, { AxiosError } from "axios";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Player } from "../types";

const buyCommand = {
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Buys an item from the shop")
    .addStringOption((option: any) => option.setName("item").setDescription("The item you want to buy").setRequired(true))
    .addIntegerOption((option: any) => option.setName("amount").setDescription("The amount of items you want to buy")),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const item = interaction.options.getString("item");
      const amount = interaction.options.getInteger("amount");

      const { data } = await axios.post<Player>("http://localhost:3000/buyItem", {
        discordId: interaction.user.id,
        itemName: item,
        amount: amount ? amount : 1,
      });

      const findMatchingItem = data.inventory.find((inventoryItem) => inventoryItem.name === item);

      if(amount && amount > 1 && findMatchingItem) {
        await interaction.reply({ content: `You bought ${amount} ${item}'s, you now have ${findMatchingItem.amount} of them` });
      }
      else if (findMatchingItem) {
        await interaction.reply({ content: `You bought an ${item}, you now have ${findMatchingItem.amount} of them` });
      }
      else {
        await interaction.reply({ content: `You bought an ${item}` });
      }
    } catch (error) {
      if(error instanceof AxiosError) {
        if (error.response?.status === 404 && error.response?.data === "No such player") {
          await interaction.reply({ content: "You don't have an account! Use /create to make one", ephemeral: true });
        }
        else if (error.response?.data === "No such item in the shop") {
          await interaction.reply({ content: "No such item in the shop", ephemeral: true });
        }
        else if (error.response?.data === "Not enough money") {
          await interaction.reply({ content: "Not enough money!", ephemeral: true });
        }
      }
    }
  }
}

export default buyCommand;
