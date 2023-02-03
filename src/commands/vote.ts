import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

const voteCommand = {
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Replies with instructions on how to vote for the bot"),
  async execute(interaction: ChatInputCommandInteraction) {
    const voteEmbed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Vote for the bot")
      .setDescription("By voting, you help me grow and in return i give you an crate you can open!\nOn weekends you get 2 crates and you can vote every 12 hours.")
      .addFields(
        { name: "Top.gg", value: "https://top.gg/bot/1063172109481824286/vote", inline: true },
      )
      .setFooter({ text: "Thank you for voting!" })
      .setTimestamp();

    await interaction.reply({ embeds: [voteEmbed] });
  }
};

export default voteCommand;
