import { ChatInputCommandInteraction, EmbedBuilder, hyperlink, SlashCommandBuilder } from "discord.js";

const inviteCommand = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Replies with an link that you can use to invite the bot to other servers"),
  async execute(interaction: ChatInputCommandInteraction) {

    const embed = new EmbedBuilder()
      .setTitle("Bit Collector's invite link")
      .setDescription(hyperlink("You can invite the bot to other servers by clicking this.", "https://discord.com/oauth2/authorize?client_id=1063172109481824286&permissions=2147551232&scope=bot"))
      .setColor("Blue")
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};

export default inviteCommand;