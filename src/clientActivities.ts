import { ActivityType } from "discord.js"


// Playing Streaming Listening Watching Competing

interface ClientActivity {
  name: string;
  type: number
}

const clientActivities: ClientActivity[] = [
  {
    name: "with bits",
    type: ActivityType.Playing
  },
  {
    name: "your bits",
    type: ActivityType.Watching
  },
  {
    name: "your commands",
    type: ActivityType.Listening
  }
]

export default clientActivities;