import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

interface ErrorEmbedParams {
  title: string;
  description: string;
  interaction: ChatInputCommandInteraction;
}

const ErrorEmbed = ({title, description, interaction}: ErrorEmbedParams) => {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor("#fc0303")
    .setFooter({ text: `Requested by ${interaction.user.tag}` })
    .setTimestamp();
}; 

export default ErrorEmbed;
