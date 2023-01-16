import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { client } from "../main";


const helpCommand = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Replies with the commands you can use"),
  async execute(interaction: ChatInputCommandInteraction) {
    if(!client.commands) throw new Error("Commands not loaded yet")
    const cmds = client.commands.map(cmd => ({ name: cmd.default.data.name, description: cmd.default.data.description}))

    const helpEmbed = new EmbedBuilder()
      .setTitle("Help")
      .addFields(
        cmds.map((cmd) => {
          return {
            name: `/${cmd.name} - ${cmd.description}`,
            value: " ",
          };
        }))
      .setColor("#ebc034")
      .setFooter({ text: `Requested by ${interaction.user.tag}` })
      .setTimestamp();
    
      interaction.reply({ embeds: [helpEmbed] });
  }
}

export default helpCommand;
