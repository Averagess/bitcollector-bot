import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

const supportCommand = {
  data: new SlashCommandBuilder()
    .setName("support")
    .setDescription("Replies with an link to the support server"),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({ content: "https://discord.gg/NKZUzR9fwS", ephemeral: true });
  }
};

export default supportCommand;