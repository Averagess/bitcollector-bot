import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import axios, { AxiosError } from "axios";

const createCommand = {
  data: new SlashCommandBuilder()
    .setName("create")
    .setDescription("Creates an BitCollector account"),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const { status } = await axios.post(
        "http://localhost:3000/initPlayer",
        {
          discordId: interaction.user.id,
          discordDisplayName: interaction.user.tag,
        }
      );
      if (status === 200) {
        await interaction.reply({ content: "Account created successfully!" });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if(!error.response) throw new Error("No response from server");
        else if(error.response.status === 409){
          await interaction.reply({ content: "You already have an account!", ephemeral: true });
        }
        }
      else {
        throw new Error(`Unknown error happened creating an account.. Reason: ${error}`)
      }
    }
  },
};

export default createCommand;
