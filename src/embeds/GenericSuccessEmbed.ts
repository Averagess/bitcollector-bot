import {
  ChatInputCommandInteraction,
  ColorResolvable,
  EmbedBuilder,
} from "discord.js";
import tips from "../resources/tips";

interface GenericSuccessEmbedParams {
  title: string;
  description?: string;
  color?: ColorResolvable;
  footer?: string;
  interaction: ChatInputCommandInteraction;
}

const GenericSuccessEmbed = ({
  title,
  color,
  footer,
  interaction,
}: GenericSuccessEmbedParams) => {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setColor(color || "#00ff00");

  const shouldShowTip = Math.round(Math.random()) === 1;

  if (shouldShowTip) {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    embed.setFooter({
      text: `TIP: ${randomTip}`,
    });
  } else if (footer) {
    embed.setFooter({ text: footer });
    if(footer.length <= 15) embed.setTimestamp();
  } else {
    embed.setFooter({ text: `Requested by ${interaction.user.tag}` });
    embed.setTimestamp();
  }

  return embed;
};

export default GenericSuccessEmbed;
