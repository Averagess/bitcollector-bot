/* eslint-disable @typescript-eslint/no-var-requires */
import fs from "node:fs";
import { REST, Routes } from "discord.js";

import { CLIENT_ID, DISCORD_TOKEN } from "../utils/config";


const commands = [];

const commandFiles = fs.readdirSync(__dirname + "/commands").filter((file:string) => file.endsWith(".ts") || file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.default.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);


(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands },
    );
    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();