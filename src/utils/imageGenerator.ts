import { CanvasRenderingContext2D, createCanvas, loadImage } from "canvas";
import { calcMinutesAfterDate, calcMinutesToDate } from "./calcMinutesHelper";
import { NODE_ENV, VERSION } from "./config";

import {
  generateBalanceParams,
  generateLeaderboardParams,
  generateCompareParams,
} from "../types";

const autoCropName = (text: string): string => {
  if (text.length > 20) return text.slice(0, 20) + "..." + text.slice(-5);
  return text;
};

const autoFontSize = (text: string, normalSize: number): string => {
  if (text.length > 15) return Math.round(400 / text.length) + "px";
  return normalSize + "px";
}
const readableNumber = (value: string): string => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const stamp = `| Bit Collector | ${NODE_ENV} | ${VERSION} |`;

const roundedImage = (x: number,y: number,width: number,height: number,radius: number, ctx: CanvasRenderingContext2D) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

const generateBalance = async ({
  balance,
  cps,
  username,
  avatarURL,
}: generateBalanceParams): Promise<Buffer> => {
  const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext("2d");
  ctx.save()

  const scaledName = scaleName(username);
  const balanceReadable = readableNumber(balance);
  const cpsReadable = readableNumber(cps);

  const bg = await loadImage("./src/resources/backdrop.png");
  ctx.drawImage(bg, 0, 0, 400, 400);

  roundedImage(140, 50, 125, 125, 20, ctx);
  const profile = await loadImage(avatarURL);
  ctx.clip();
  ctx.drawImage(profile, 140, 50, 125, 125);
  ctx.restore()

  ctx.fillStyle = "#FFFFFF";
  const smartUsernamesize =
    scaledName.length > 15
      ? Math.round(400 / scaledName.length) + "px"
      : "34px";
  ctx.font = `${smartUsernamesize} Arial`;
  ctx.textAlign = "center";
  ctx.fillText(`${scaledName}'s balance`, 200, 225);

  ctx.fillStyle = "#FFFFFF";
  const smartBalanceSize = balanceReadable.length > 10 ? "24px" : "28px";
  ctx.font = `${smartBalanceSize} Arial`;
  ctx.textAlign = "center";
  ctx.fillText(`${balanceReadable} Bits`, 200, 275);

  if (balance.length >= 1) {
    const smartCpsSize = cpsReadable.length > 10 ? "20px" : "24px";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `${smartCpsSize} Arial`;
    ctx.textAlign = "center";
    ctx.fillText(`CPS: ${cpsReadable} bits/s`, 200, 325);
  }

  ctx.fillStyle = "#808080";
  ctx.font = "10px Arial";
  ctx.textAlign = "center";

  ctx.fillText(stamp, 200, 375);

  const buffer = canvas.toBuffer("image/png");
  return buffer;
};

const alphabet =
  "abcdefghijklmnopqrstuvwxyzöäåABCDEFGHIJKLMNOPQRSTUVWXYZöäå".split("");

const generateLeaderboard = async ({
  players,
  createdAt,
  nextUpdate,
}: generateLeaderboardParams): Promise<Buffer> => {
  const canvas = createCanvas(800, 500);
  const ctx = canvas.getContext("2d");

  const bg = await loadImage("./src/resources/backdrop-wide.png");
  ctx.drawImage(bg, 0, 0, 800, 500);

  players.forEach((player, index) => {
    if (alphabet.includes(player.discordDisplayName[0])) {
      player.discordDisplayName =
        player.discordDisplayName[0].toUpperCase() +
        player.discordDisplayName.slice(1);
    }
    const scaledName = scaleName(player.discordDisplayName);
    const balanceReadable = readableNumber(player.balance);
    const cpsReadable = readableNumber(player.cps.toString());
    const smartUsernamesize =
      scaledName.length > 15
        ? Math.round(400 / scaledName.length) + "px"
        : "20px";

    if (index < 5) {
      ctx.fillStyle = "#FFFFFF";
      ctx.font = `${36}px Arial`;
      ctx.textAlign = "center";
      ctx.fillText(`${index + 1}.`, 50, 70 + index * 80);

      ctx.font = `${smartUsernamesize} Arial`;
      ctx.textAlign = "left";
      ctx.fillText(`${scaledName}`, 90, 70 + index * 80);

      ctx.font = `${smartUsernamesize} Arial`;
      ctx.textAlign = "center";

      ctx.font = `${15}px Arial`;

      ctx.fillText("Balance", 50, 90 + index * 80);
      ctx.textAlign = "left";
      ctx.fillText(`${balanceReadable} Bits`, 90, 90 + index * 80);
      ctx.textAlign = "center";
      ctx.fillText("CPS", 50, 110 + index * 80);
      ctx.textAlign = "left";
      ctx.fillText(`${cpsReadable} Bits/s`, 90, 110 + index * 80);
    } else {
      ctx.fillStyle = "#FFFFFF";
      ctx.font = `${36}px Arial`;
      ctx.textAlign = "center";
      ctx.fillText(`${index + 1}.`, 500, 70 + (index - 5) * 80);

      ctx.font = `${smartUsernamesize} Arial`;
      ctx.textAlign = "left";
      ctx.fillText(`${scaledName}`, 540, 70 + (index - 5) * 80);

      ctx.font = `${15}px Arial`;
      ctx.textAlign = "center";

      ctx.fillText("Balance", 500, 90 + (index - 5) * 80);
      ctx.textAlign = "left";
      ctx.fillText(`${balanceReadable} Bits`, 540, 90 + (index - 5) * 80);
      ctx.textAlign = "center";
      ctx.fillText("CPS", 500, 110 + (index - 5) * 80);
      ctx.textAlign = "left";
      ctx.fillText(`${cpsReadable} Bits/s`, 540, 110 + (index - 5) * 80);
    }
  });
  ctx.fillStyle = "#808080";
  ctx.font = `${15}px Arial`;
  ctx.textAlign = "center";

  const prettyCreatedAt = calcMinutesAfterDate(createdAt);
  const prettyUpdate = calcMinutesToDate(new Date(), nextUpdate);

  ctx.fillText(
    `Leaderboard updated ${prettyCreatedAt} minutes ago, next update in ${prettyUpdate} minutes`,
    400,
    470
  ) + " minutes";

  return canvas.toBuffer("image/png");
};

export const generateCompare = async ({
  client,
  target,
  targetAvatarURL,
  clientAvatarURL,
}: generateCompareParams): Promise<Buffer> => {
  const canvas = createCanvas(800, 500);
  const ctx = canvas.getContext("2d");
  ctx.save()

  const bg = await loadImage("./src/resources/backdrop-wide.png");
  ctx.drawImage(bg, 0, 0, 800, 500);

  const clientAvatar = await loadImage(clientAvatarURL);
  const targetAvatar = await loadImage(targetAvatarURL);

  roundedImage(50, 50, 100, 100, 20, ctx)
  ctx.clip()
  ctx.drawImage(clientAvatar, 50, 50, 100, 100);
  ctx.restore()
  ctx.save()

  roundedImage(650, 50, 100, 100, 20, ctx)
  ctx.clip()
  ctx.drawImage(targetAvatar, 650, 50, 100, 100);
  ctx.restore()

  const clientBalanceReadable = readableNumber(client.balance);
  const targetBalanceReadable = readableNumber(target.balance);
  const clientCPSReadable = readableNumber(client.cps.toString());
  const targetCPSReadable = readableNumber(target.cps.toString());

  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "left";

  const scaledClient = scaleName(client.discordDisplayName);
  const scaledTarget = scaleName(target.discordDisplayName);

  const clientSize =
    scaledClient.length > 15
      ? Math.round(400 / scaledClient.length) + "px"
      : "34px";
  const targetSize =
    scaledTarget.length > 15
      ? Math.round(400 / scaledTarget.length) + "px"
      : "34px";

  ctx.font = `${clientSize} Arial`;
  ctx.fillText(`${scaledClient}`, 50, 200);

  ctx.font = `${targetSize} Arial`;
  ctx.textAlign = "right";
  ctx.fillText(`${scaledTarget}`, 750, 200);

  ctx.textAlign = "center";
  ctx.font = `${100}px Arial`;
  if (BigInt(client.balance) > BigInt(target.balance)) {
    ctx.fillText(">", 400, 125);
  } else if (BigInt(client.balance) < BigInt(target.balance)) {
    ctx.fillText("<", 400, 125);
  } else {
    ctx.fillText("=", 400, 125);
  }

  ctx.font = `${16}px Arial`;
  ctx.fillText("Balance", 400, 240);
  ctx.fillText("CPS", 400, 260);

  ctx.strokeStyle = "rgba(242,243,244,0.5)";
  ctx.lineWidth = 1;
  ctx.beginPath();

  ctx.lineTo(50, 245);
  ctx.lineTo(750, 245);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.lineTo(50, 265);
  ctx.lineTo(750, 265);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.lineTo(50, 305);
  ctx.lineTo(750, 305);
  ctx.stroke();
  ctx.closePath();

  ctx.textAlign = "left";
  ctx.fillText(`${clientBalanceReadable} Bits`, 50, 240);
  ctx.fillText(`${clientCPSReadable} Bits/s`, 50, 260);

  ctx.textAlign = "right";
  ctx.fillText(`${targetBalanceReadable} Bits`, 750, 240);
  ctx.fillText(`${targetCPSReadable} Bits/s`, 750, 260);

  ctx.textAlign = "left";
  ctx.fillText(`${new Date(client.createdAt).toUTCString()}`, 50, 300);
  ctx.textAlign = "center";
  ctx.fillText(`Joined`, 400, 300);
  ctx.textAlign = "right";
  ctx.fillText(`${new Date(target.createdAt).toUTCString()}`, 750, 300);

  ctx.fillStyle = "#808080";
  ctx.font = `${15}px Arial`;
  ctx.textAlign = "center";
  ctx.fillText(stamp, 400, 470);

  return canvas.toBuffer("image/png");
};

export { generateBalance, generateLeaderboard };
