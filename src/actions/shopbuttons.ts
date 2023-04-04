import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

const shopbuttons = (
  disableToFirst: boolean,
  disableBuy: boolean,
  disableToLast: boolean
) => {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("toFirstShopItem")
      .setLabel("<<")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disableToFirst),
    new ButtonBuilder()
      .setCustomId("previousShopItem")
      .setLabel("Previous")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disableToFirst),
    new ButtonBuilder()
      .setCustomId("buyCurrentItem")
      .setLabel("Buy")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disableBuy),
    new ButtonBuilder()
      .setCustomId("nextShopItem")
      .setLabel("Next")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disableToLast),
    new ButtonBuilder()
      .setCustomId("toLastShopItem")
      .setLabel(">>")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disableToLast)
  );
};

export default shopbuttons;
