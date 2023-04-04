import { CanvasRenderingContext2D, createCanvas, loadImage } from "canvas";
import { NODE_ENV, VERSION } from "./config";

import {
  generateBalanceParams,
  generateCompareParams,
} from "../types";

const autoCropName = (text: string): string => {
  const tag = text.slice(-5);
  const nameWithoutTag = text.slice(0, -5);
  if (nameWithoutTag.length >= 18) return nameWithoutTag + "..." + tag;
  return text;
};

const autoFontSize = (text: string, normalSize: number): string => {
  if (text.length > 15) return Math.round(400 / text.length) + "px";
  return normalSize + "px";
};

const readableNumber = (value: string): string => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const stamp = `| Bit Collector | ${NODE_ENV} | ${VERSION} |`;

const roundedImage = (x: number, y: number, width: number, height: number, radius: number, ctx: CanvasRenderingContext2D) => {
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
};

export const generateBalance = async ({
  balance,
  cps,
  username,
  avatarURL,
}: generateBalanceParams): Promise<Buffer> => {
  const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext("2d");
  ctx.save();

  const croppedUsername = autoCropName(username);
  const balanceReadable = readableNumber(balance);
  const cpsReadable = readableNumber(cps);

  const bg = await loadImage("./src/resources/backdrop.png");
  ctx.drawImage(bg, 0, 0, 400, 400);

  roundedImage(140, 50, 125, 125, 20, ctx);
  const profile = await loadImage(avatarURL);
  ctx.clip();
  ctx.drawImage(profile, 140, 50, 125, 125);
  ctx.restore();

  ctx.fillStyle = "#FFFFFF";
  const usernameFontSize = autoFontSize(croppedUsername, 28);
  ctx.font = `${usernameFontSize} Arial`;
  ctx.textAlign = "center";
  ctx.fillText(`${croppedUsername}'s balance`, 200, 225);

  const smartBalanceSize = balanceReadable.length > 10 ? "24px" : "28px";
  ctx.font = `${smartBalanceSize} Arial`;
  ctx.textAlign = "center";
  ctx.fillText(`${balanceReadable} Bits`, 200, 275);

  if (balance.length >= 1) {
    const smartCpsSize = cpsReadable.length > 10 ? "20px" : "24px";
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

export const generateCompare = async ({
  client,
  target,
  targetAvatarURL,
  clientAvatarURL,
}: generateCompareParams): Promise<Buffer> => {
  const canvas = createCanvas(800, 500);
  const ctx = canvas.getContext("2d");
  ctx.save();

  const bg = await loadImage("./src/resources/backdrop-wide.png");
  ctx.drawImage(bg, 0, 0, 800, 500);

  const clientAvatar = await loadImage(clientAvatarURL);
  const targetAvatar = await loadImage(targetAvatarURL);

  roundedImage(50, 50, 100, 100, 20, ctx);
  ctx.clip();
  ctx.drawImage(clientAvatar, 50, 50, 100, 100);
  ctx.restore();
  ctx.save();

  roundedImage(650, 50, 100, 100, 20, ctx);
  ctx.clip();
  ctx.drawImage(targetAvatar, 650, 50, 100, 100);
  ctx.restore();

  const clientBalanceReadable = readableNumber(client.balance);
  const targetBalanceReadable = readableNumber(target.balance);

  const clientCPSReadable = readableNumber(client.cps.toString());
  const targetCPSReadable = readableNumber(target.cps.toString());

  const croppedClient = autoCropName(client.discordDisplayName);
  const croppedTarget = autoCropName(target.discordDisplayName);

  const clientFontsize = autoFontSize(croppedClient, 34);
  const targetFontsize = autoFontSize(croppedTarget, 34);

  ctx.fillStyle = "#FFFFFF";

  ctx.textAlign = "left";
  ctx.font = `${clientFontsize} Arial`;
  ctx.fillText(`${croppedClient}`, 50, 200);

  ctx.textAlign = "right";
  ctx.font = `${targetFontsize} Arial`;
  ctx.fillText(`${croppedTarget}`, 750, 200);

  ctx.textAlign = "center";
  ctx.font = `${100}px Arial`;

  let symbol;
  if (BigInt(client.balance) > BigInt(target.balance)) symbol = ">";
  else if (BigInt(client.balance) < BigInt(target.balance)) symbol = "<";
  else symbol = "=";
  ctx.fillText(`${symbol}`, 400, 125);

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
  ctx.fillText("Joined", 400, 300);
  ctx.textAlign = "right";
  ctx.fillText(`${new Date(target.createdAt).toUTCString()}`, 750, 300);

  ctx.fillStyle = "#808080";
  ctx.font = `${15}px Arial`;
  ctx.textAlign = "center";
  ctx.fillText(stamp, 400, 470);

  return canvas.toBuffer("image/png");
};