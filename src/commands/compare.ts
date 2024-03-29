import { AxiosError } from "axios";
import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
  User,
} from "discord.js";
import { GenericErrorEmbed, NoAccountEmbed } from "../embeds";
import { fetchTwoPlayers } from "../services/posters";
import { generateCompare } from "../utils/imageGenerator";

const compareCommand = {
  data: new SlashCommandBuilder()
    .setName("compare")
    .setDescription("Compare your stats with another player")
    .addMentionableOption((option) =>
      option
        .setName("player")
        .setDescription("The player you want to compare with")
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const target = interaction.options.getMentionable("player");

    if((target instanceof GuildMember && target.user.bot) || (target instanceof User && target.bot)){
      const errorEmbed = GenericErrorEmbed({ title: "Couldnt execute command", description: "You cant compare your account with bots..", interaction });
      return await interaction.editReply({ embeds: [errorEmbed] });
    }

    if (target instanceof GuildMember || target instanceof User) {
      const targetID = target.id;
      const clientID = interaction.user.id;
      try {
        const { data } = await fetchTwoPlayers(clientID, targetID);
        const img = await generateCompare({
          client: data.client,
          target: data.target,
          clientAvatarURL: interaction.user.displayAvatarURL({
            extension: "png",
            size: 128,
          }),
          targetAvatarURL: target.displayAvatarURL({
            extension: "png",
            size: 128,
          }),
        });
        await interaction.editReply({ files: [img] });
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          if (error.response.data.error === "target not found") {
            const errorEmbed = GenericErrorEmbed({ title: "Couldnt execute command!", description: "The target doesn't have an account, cant compare :(", interaction });
            return await interaction.editReply({ embeds: [errorEmbed] });
          } else if (error.response.data.error === "client not found") {
            const errorEmbed = NoAccountEmbed(interaction);
            return await interaction.editReply({ embeds: [errorEmbed] });
          }
        } else throw error;
      }
    } else {
      return await interaction.editReply({
        content: "You need to mention a user",
      });
    }
  },
};

export default compareCommand;
