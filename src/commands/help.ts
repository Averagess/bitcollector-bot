import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { client } from "../client";
import GenericSuccessEmbed from "../utils/GenericSuccessEmbed";


const helpCommand = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Replies with the commands you can use"),
  async execute(interaction: ChatInputCommandInteraction) {
    if(!client.commands) return await interaction.reply("There are no commands to show")
    const cmds = client.commands.map(cmd => ({ name: cmd.default.data.name, description: cmd.default.data.description}))

    const helpEmbed = GenericSuccessEmbed({ title: "Commands", interaction })
      .setDescription("The commands you can use")
      .addFields(
        cmds.map((cmd) => {
          return {
            name: `\`/${cmd.name}\``,
            value: cmd.description,
          };
        }))
    
      return await interaction.reply({ embeds: [helpEmbed] });
  }
}

export default helpCommand;
