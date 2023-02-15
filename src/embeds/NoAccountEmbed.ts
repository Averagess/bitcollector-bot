import { ChatInputCommandInteraction } from "discord.js";

import GenericErrorEmbed from "./GenericErrorEmbed";

const NoAccountEmbed = (interaction: ChatInputCommandInteraction) => {
  return GenericErrorEmbed({
    title: "Couldnt execute command!",
    description: "You don't have an account yet! Use /create to create one",
    interaction,
  });
};

export default NoAccountEmbed;