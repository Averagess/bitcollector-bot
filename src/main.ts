import { AxiosError } from "axios";
import { Events } from "discord.js";
import cron from "node-cron";

import { client } from "./client";
import GenericErrorEmbed from "./embeds/GenericErrorEmbed";
import { addBitToPlayer } from "./services/posters";
import {
  refreshCommands,
  updateAnalytics,
  updateClientActivity,
  updateItems,
} from "./utils/callbacks";
import { DISCORD_TOKEN } from "./utils/config";
import logger from "./utils/logger";

client.once(Events.ClientReady, async (c) => {
  logger.info(`Logged in as ${c.user.tag} and ready to receive commands.`);

  await updateAnalytics(c);

  updateClientActivity(c);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands?.get(interaction.commandName);

  if (!command) return;
  const start = Date.now();

  try {
    await command.default.execute(interaction);
    const end = Date.now();
    logger.info(
      `Succesfully executed command [${interaction.commandName}] by ${
        interaction.user.tag
      }, took ${end - start}ms`
    );
  } catch (error) {
    const end = Date.now();
    if (error instanceof AxiosError) {
      if (!error.response) {
        logger.error(
          `No response from server when trying to execute command [${
            interaction.commandName
          }] by ${interaction.user.tag}. took ${end - start}ms, error:${error}`
        );
        const errorEmbed = GenericErrorEmbed({
          title: "Something went wrong.",
          description:
            "I am having connection issues.. Please try again later.",
          interaction,
        });
        await interaction.editReply({ embeds: [errorEmbed] });
      } else if (error.response.data.error === "Player is blacklisted") {
        logger.warn(
          `Player ${interaction.user.tag} is blacklisted!, command blocked!`
        );
        const errorEmbed = GenericErrorEmbed({
          title: "Something went wrong.",
          description:
            "You are blacklisted from using this bot! Please contact the bot owner for more information.",
          interaction,
        });
        await interaction.editReply({ embeds: [errorEmbed] });
      }
    } else if (error instanceof Error) {
      logger.error(
        `Error raised when trying to execute command [${
          interaction.commandName
        }] by ${interaction.user.tag}. took ${end - start}ms Reason: ${
          error.message
        }`
      );
      const errorEmbed = GenericErrorEmbed({
        title: "Something went wrong.",
        description: "Oops. Something went wrong. Please try again later..",
        interaction,
      });
      await interaction.editReply({ embeds: [errorEmbed] });
    } else {
      logger.error(
        `UNKNOWN ERROR raised when trying to execute command [${
          interaction.commandName
        }] by ${interaction.user.tag}. took ${end - start} Reason:`,
        error
      );
      const errorEmbed = GenericErrorEmbed({
        title: "Something went wrong.",
        description: "An error occured while running this command!",
        interaction,
      });
      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isAutocomplete()) return;

  const command = client.commands?.get(interaction.commandName);

  if (!command) {
    logger.warn(
      `Autocomplete interaction received for an unknown command [${interaction.commandName}]`
    );
    return;
  }

  const start = Date.now();

  try {
    await command.default.autocomplete(interaction);
    const end = Date.now();
    logger.info(
      `Succesfully executed autocomplete interaction for command [${
        interaction.commandName
      }] by ${interaction.user.tag} took ${end - start}ms`
    );
  } catch (error) {
    const end = Date.now();
    logger.error(
      `Error was raised when trying to execute autocomplete interaction for command [${
        interaction.commandName
      }] by ${interaction.user.tag}. took ${end - start} Reason: ${error}`
    );
  }
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  try {
    await addBitToPlayer(message.author.id);
    logger.info(`Succesfully added bit to ${message.author.tag}`);
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) return;
      else if (!error.response)
        logger.error(
          "No response from server when adding bit to user! Backend or DB Down?",
          error
        );
    } else
      logger.error(
        `UNKNOWN Error raised when trying to add a bit to user: ${message.author.tag}. Error: ${error}`
      );
  }
});

cron.schedule("*/15 * * * *", () => updateClientActivity(client));

setTimeout(() => updateItems(), 5000);
cron.schedule("0 0 * * *", () => updateItems());

cron.schedule("0 */6 * * *", () => updateAnalytics(client));

refreshCommands();

client.login(DISCORD_TOKEN);

process.on("SIGINT", () => {
  logger.info("SIGINT received. Exiting...");
  client.destroy();
  process.exit(0);
});
