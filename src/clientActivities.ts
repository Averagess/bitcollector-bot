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
    name: "Counting your bits",
    type: ActivityType.Custom
  },
  {
    name: "your commands",
    type: ActivityType.Listening
  }
]

export default clientActivities;