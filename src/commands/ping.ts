import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

const pingCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction: ChatInputCommandInteraction) {
    const timeTook = Date.now() - interaction.createdAt.valueOf()
    await interaction.reply(`Pong! after ${timeTook}ms`);
  }
}

export default pingCommand;
