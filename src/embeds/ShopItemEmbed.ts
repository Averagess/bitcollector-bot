import { InventoryItem } from "../types";
import readableNumber from "../utils/readableNumber";
import GenericSuccessEmbed from "./GenericSuccessEmbed";

interface ShopItemEmbedParams {
  title: string;
  description?: string;
  item: InventoryItem;
  indexes: [number, number] // First value is the current items index, and the second is total number of items
}
const ShopItemEmbed = ({
  title,
  description,
  item,
  indexes,
}: ShopItemEmbedParams) => {
  const embed = GenericSuccessEmbed({
    title: `${title} (${indexes[0] + 1}/${indexes[1] + 1})`,
    description,
    tip: false,
  });

  const fields = [
    {
      name: "Name",
      value: item.name,
      inline: false,
    },
    {
      name: "Price",
      value: readableNumber(item.price.toString()),
      inline: false,
    },
    {
      name: "CPS",
      value: readableNumber(item.cps.toString()),
      inline: false,
    },
    {
      name: "You own",
      value: readableNumber(item.amount.toString()),
      inline: false,
    }
  ];

  embed.addFields(fields);

  return embed;
};

export default ShopItemEmbed;
