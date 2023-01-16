import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import { readdirSync } from "fs";
import path from "node:path";

import config from "./utils/config";


export interface extendedClient extends Client {
  commands?: Collection<string, any>;
}

export const client: extendedClient = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
  if(c.user) console.log(`Ready, logged in as ${c.user.tag}`);
  else console.log("Ready, but not logged in");
});


client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith(".ts"));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command.default && 'execute' in command.default) {
		client.commands.set(command.default.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}


client.on(Events.InteractionCreate, async interaction => {
  if(!interaction.isChatInputCommand()) return;
  const command = client.commands?.get(interaction.commandName);

  if(!command) return;

  try {
    await command.default.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
})


client.login(config.DISCORD_TOKEN);