import axios, { AxiosError } from "axios";
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Player } from "../types";

const inventoryCommand = {
  data: new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("Replies with your inventory"),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply()
      
      const { data }  = await axios.post<Player>("http://localhost:3000/updatePlayer", {
        discordId: interaction.user.id,
      })

      const inventoryEmbed = new EmbedBuilder()
        .setTitle(`${interaction.user.tag}'s inventory`)
        .addFields(
          data.inventory.map((item, index) => {
            return {
              name: `${index+1}. ${item.name}`,
              value: `Amount: ${item.amount.toString()}\nCPS: ${item.cps * item.amount} bits/s`,
              inline: true,
            };
          }
        ))
        .setColor("#a1fc03")
        .setFooter({ text: `Requested by ${interaction.user.tag}` })
        .setTimestamp();

      await interaction.editReply({ embeds: [inventoryEmbed]  });
    } catch (error) {
      if(error instanceof AxiosError){
        if(!error.response) throw new Error("No response from server")
        else if(error.response.status === 404) return await interaction.editReply({ content: "You don't have an account yet! Use /start to create one" });
        else throw new Error(("Unknown axios error raised when trying to fetch inventory. Error: ${error}"))
      }
      else {
        throw new Error("Unknown error raised when trying to fetch inventory. Error: ${error}");
      }
    }
  }
}

export default inventoryCommand;