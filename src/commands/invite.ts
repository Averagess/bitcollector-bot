import { ChatInputCommandInteraction, EmbedBuilder, hyperlink, SlashCommandBuilder } from "discord.js";

const inviteCommand = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Replies with an link where you can invite the bot"),
  async execute(interaction: ChatInputCommandInteraction) {
    // const embed = GenericSuccessEmbed({ title: "Invite link", description: hyperlink("you can invite the bot from here", "https://discord.com/oauth2/authorize?client_id=1063172109481824286&permissions=2147551232&scope=bot"), interaction });
    const embed = new EmbedBuilder()
      .setTitle("Bit Collector's invite link")
      .setDescription(hyperlink("You can invite the bot to other servers by clicking this.", "https://discord.com/oauth2/authorize?client_id=1063172109481824286&permissions=2147551232&scope=bot"))
      .setColor("Blue")
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};

export default inviteCommand;