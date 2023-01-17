import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

const pingCommand = {
  data: new SlashCommandBuilder()
    .setName("faq")
    .setDescription("Replies with an list of Frequently Asked Questions"),
  async execute(interaction: ChatInputCommandInteraction) {
    const faqEmbed = new EmbedBuilder()
      .setTitle("Frequently Asked Questions")
      .addFields(
        {
          name: "What is this bot?",
          value: "Bit Collector is a bot that allows you to collect an currency called bits, you can use these bits to buy upgrades that will increase your bits per second (CPS), with these bits you can compete with other players across the world.",
        },
        {
          name: "How do I get started?",
          value: "To get started, send messages in chats on servers that the bot is in. when your balance hits 50 you can buy your first upgrade, you can buy upgrades by using the `/buy` command.",
        },
        {
          name: "How do I get more bits?",
          value: "You can get more bits by sending messages in chats on servers that the bot is in, you can also buy upgrades that will increase your bits per second (CPS).",
        },
        {
          name: "I believe I have found a bug, what do I do?",
          value: "If you believe you have found a bug, please report it in the support server, depending on the severity of the bug you might get an reward. You can join the support server by using the `/support` command.",
        },
        {
          name: "I have an feature suggestion, what do I do?",
          value: "I'd love to hear your suggestions, you can send them in the support server, you can join the support server by using the `/support` command.",
        }
      )
      .setColor("#ebc034")
      .setFooter({ text: `Requested by ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [faqEmbed] });
  }
}

export default pingCommand;
