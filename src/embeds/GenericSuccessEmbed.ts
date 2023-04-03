import {
  ChatInputCommandInteraction,
  ColorResolvable,
  EmbedBuilder,
} from "discord.js";
import tips from "../resources/tips";
import { VERSION } from "../utils/config";

interface GenericSuccessEmbedParams {
  title: string;
  description?: string;
  color?: ColorResolvable;
  footer?: string;
  tip?: boolean;
  interaction?: ChatInputCommandInteraction;
}

const GenericSuccessEmbed = ({
  title,
  description,
  color,
  footer,
  tip = true,
  interaction,
}: GenericSuccessEmbedParams) => {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setColor(color || "#00ff00");

  if (description) embed.setDescription(description);

  const shouldShowTip = tip ? Math.round(Math.random()) === 1 : false;

  if (shouldShowTip) {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    embed.setFooter({
      text: `TIP: ${randomTip}`,
    });
  } else if (footer) {
    embed.setFooter({ text: footer });
    if(footer.length <= 15) embed.setTimestamp();
  } else if(interaction) {
    embed.setFooter({ text: `Requested by ${interaction.user.tag} | Bit Collector v${VERSION} |` });
    embed.setTimestamp();
  }

  return embed;
};

export default GenericSuccessEmbed;
