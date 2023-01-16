import { Client, GatewayIntentBits, Collection } from "discord.js";
import { readdirSync } from "fs";
import path from "path";
import { extendedClient } from "./types";


export const client: extendedClient = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });


client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith(".ts"));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
  if(process.argv[1] !== "./src/main.ts") continue
	if ('data' in command.default && 'execute' in command.default) {
		client.commands.set(command.default.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
