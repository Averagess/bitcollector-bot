import * as dotenv from "dotenv";
dotenv.config();

import pkg from "../../package.json";

if(!process.env.DISCORD_TOKEN) throw new Error("DISCORD_TOKEN is not set in .env");
if(!process.env.GUILD_ID) throw new Error("GUILD_ID is not set in .env");
if(!process.env.CLIENT_ID) throw new Error("CLIENT_ID is not set in .env");
if(!process.env.APIKEY) throw new Error("APIKEY is not set in .env");
if(!process.env.BACKEND_URL) console.warn("BACKEND_URL is not set in .env, using http://localhost:3000/api");
if(!process.env.NODE_ENV) console.warn("NODE_ENV is not set in .env, using development");

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
export const GUILD_ID = process.env.GUILD_ID;
export const CLIENT_ID = process.env.CLIENT_ID;
export const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000/api";
export const NODE_ENV = process.env.NODE_ENV || "development";
export const VERSION = process.env.npm_package_version || pkg.version;
export const APIKEY = process.env.APIKEY;