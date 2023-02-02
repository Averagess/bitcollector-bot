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
          value: `Bit Collector is a bot that allows you to collect an currency called Bits,
                  you can use these bits to buy items that will increase your bits per second (CPS),
                  with these bits you can compete with other players across the world.`,
        },
        {
          name: "How do I get started?",
          value: `To get started, send messages in chats on servers that the bot is in.
                  You can also get some bits by using the \`/daily\` command!
                  You will get bits for every message you send, and you can view
                  how many bits you have by using \`/balance\`.
                  When your balance hits 50 bits, you can buy your first item.
                  You can check out the available items by using the \`/store\` command and then,
                  you can buy items by using the \`/buy\` command.`,
        },
        {
          name: "How do I get more bits?",
          value: `You can get more bits by sending messages in chats on servers that the bot is in for every message you get 1 Bit, you can also get daily bits by using the \`/daily\` command.
                  you can also \`/vote\` for the bot, which grants you an crate, when you open this crate by using \`/crate\` you get some bits and a random item.
                  when you have enough bits at the start, you can buy your first item from the \`/store\` and this item will give you bits on the background, even when you are offline.`,
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
