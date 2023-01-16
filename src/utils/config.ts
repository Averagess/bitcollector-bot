import * as dotenv from "dotenv"
dotenv.config()

if(!process.env.DISCORD_TOKEN) throw new Error("DISCORD_TOKEN is not set in .env")
if(!process.env.GUILD_ID) throw new Error("GUILD_ID is not set in .env")
if(!process.env.CLIENT_ID) throw new Error("CLIENT_ID is not set in .env")

const config = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  GUILD_ID: process.env.GUILD_ID,
  CLIENT_ID: process.env.CLIENT_ID,
}

export default config;