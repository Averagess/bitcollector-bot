import * as dotenv from "dotenv"
dotenv.config()

import pkg from "../../package.json"

if(!process.env.DISCORD_TOKEN) throw new Error("DISCORD_TOKEN is not set in .env")
if(!process.env.GUILD_ID) throw new Error("GUILD_ID is not set in .env")
if(!process.env.CLIENT_ID) throw new Error("CLIENT_ID is not set in .env")
if(!process.env.BACKEND_URL) console.warn("BACKEND_URL is not set in .env, using localhost")
if(!process.env.NODE_ENV) console.warn("NODE_ENV is not set in .env, using development")

const config = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  GUILD_ID: process.env.GUILD_ID,
  CLIENT_ID: process.env.CLIENT_ID,
  BACKEND_URL: process.env.BACKEND_URL || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
  VERSION: process.env.npm_package_version || pkg.version,
}

export default config;