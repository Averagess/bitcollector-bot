/* eslint-disable @typescript-eslint/no-var-requires */
import config from "./utils/config";
import { REST, Routes } from 'discord.js';
import fs from 'node:fs';


const commands = [];

const commandFiles = fs.readdirSync(__dirname + "/commands").filter((file:string) => file.endsWith(".ts"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.default.data.toJSON());
}

console.log(commands)

const rest = new REST({ version: '10' }).setToken(config.DISCORD_TOKEN);


(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const data: any = await rest.put(
			Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID),
			{ body: commands },
		);
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();