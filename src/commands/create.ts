import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import axios, { AxiosError } from "axios";
import ErrorEmbed from "../utils/ErrorEmbed";
import config from "../utils/config";

const createCommand = {
  data: new SlashCommandBuilder()
    .setName("create")
    .setDescription("Creates an account for you"),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply();

      const { status } = await axios.post(
        `${config.BACKEND_URL}/initPlayer`,
        {
          discordId: interaction.user.id,
          discordDisplayName: interaction.user.tag,
        }
      );
      if (status === 200) {
        const successEmbed = new EmbedBuilder()
          .setTitle("Account created successfully!")
          .setDescription("Next step is to use check out /store and then /buy to buy your first item!")
          .setColor("#a1fc03")
          .setFooter({ text: `Requested by ${interaction.user.tag}` })
          .setTimestamp();
        await interaction.editReply({ embeds: [successEmbed] });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if(!error.response) throw new Error("No response from server");
        else if(error.response.status === 409){
          const errorEmbed = ErrorEmbed({ title: "Account creation cancelled!", description: "You already have an account!", interaction: interaction })
          await interaction.editReply({ embeds: [errorEmbed] });
        }
        else throw new Error(`Unknown AxiosError raised creating an account.. Reason: ${error}`)
      }
      else {
        throw new Error(`Unknown error happened creating an account.. Reason: ${error}`)
      }
    }
  },
};

export default createCommand;
