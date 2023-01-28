import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

const faqCommand = {
  data: new SlashCommandBuilder()
    .setName("faq")
    .setDescription("Replies with an list of frequently asked questions"),
  async execute(interaction: ChatInputCommandInteraction) {
    const faqEmbed = new EmbedBuilder()
      .setTitle("Frequently Asked Questions")
      .addFields(
        {
          name: "What is this bot?",
          value: `Bit Collector is a bot that allows you to collect an currency called bits,
                  you can use these bits to buy upgrades that will increase your bits per second (CPS),
                  with these bits you can compete with other players across the world.`,
        },
        {
          name: "How do I get started?",
          value: `To get started, send messages in chats on servers that the bot is in.
                  You can also get bits by using the \`/daily\` command and by voting the bot.
                  You will get bits for every message you send, and you can view
                  how many bits you have by using \`/balance\`.
                  When your balance hits 50 bits, you can buy your first upgrade.
                  You can check out the upgrades by using the \`/store\` command and then,
                  you can buy upgrades by using the \`/buy\` command.`,
        },
        {
          name: "How do I get more bits?",
          value: `You can get more bits by sending messages in chats on servers that the bot is in,
                  and you can also buy upgrades from the store with bits that will increase your bits per second (CPS) that increase your balance in the background.`,
        },
        {
          name: "I believe I have found a bug, what do I do?",
          value:
            "If you believe you have found a bug, please report it in the support server, depending on the severity of the bug you might get an reward. You can join the support server by using the `/support` command.",
        },
        {
          name: "I have an feature suggestion, what do I do?",
          value:
            "I'd love to hear your suggestions, you can send them in the support server, you can join the server by using the `/support` command.",
        }
      )
      .setColor("#ebc034")
      .setFooter({ text: `Requested by ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [faqEmbed] });
  },
};

export default faqCommand;
