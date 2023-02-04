import { ActivityType } from "discord.js";
import { ClientActivity } from "../types";

// Playing Streaming Listening Watching Competing
const clientActivities: ClientActivity[] = [
  {
    name: "with bits",
    type: ActivityType.Playing
  },
  {
    name: "servers..",
    type: ActivityType.Watching
  },
  {
    name: "your commands",
    type: ActivityType.Listening
  },
  {
    name: "with the Discord API",
    type: ActivityType.Playing
  },
];

export default clientActivities;