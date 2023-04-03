import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";


const shopbuttons = (toFirst: boolean, toLast: boolean) => {
  return new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder().setCustomId("toFirstShopItem").setLabel("<<").setStyle(ButtonStyle.Primary).setDisabled(toFirst),
      new ButtonBuilder().setCustomId("previousShopItem").setLabel("Previous").setStyle(ButtonStyle.Primary).setDisabled(toFirst),
      new ButtonBuilder().setCustomId("nextShopItem").setLabel("Next").setStyle(ButtonStyle.Primary).setDisabled(toLast),
      new ButtonBuilder().setCustomId("toLastShopItem").setLabel(">>").setStyle(ButtonStyle.Primary).setDisabled(toLast),
    );
};

export default shopbuttons;