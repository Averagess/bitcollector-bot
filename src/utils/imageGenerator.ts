import { createCanvas, loadImage } from "canvas";

const canvas = createCanvas(400, 400);
const ctx = canvas.getContext("2d");

interface generateBalanceParams {
  balance: string;
  cps: string;
  username: string;
  avatarURL: string;
}

const generateBalance = async ({balance, cps, username, avatarURL}: generateBalanceParams): Promise<Buffer> => {
  const balanceReadable = balance.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const bg = await loadImage("./src/utils/backdrop-scaled.png")
  ctx.drawImage(bg, 0, 0, 400, 400);

  const profile = await loadImage(avatarURL);
  ctx.drawImage(profile, 140, 50, 125, 125);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "34px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`${username}'s balance`, 200, 225);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "28px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`${balanceReadable} bits`, 200, 275);

  if(balance.length > 1) {
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`CPS: ${cps} bits/s`, 200, 325);
  }


  const buffer = canvas.toBuffer("image/png");
  return buffer;
};

// const save = async (balance: number | string, cps: number | string, username: string, profileURL: string): Promise<void> => {
//   const buffer = await generateBalance(balance, cps, username, profileURL);
//   const fs = require("fs");
//   fs.writeFileSync("balance.png", buffer);
// };

// save(1000, 1, "test", "https://cdn.discordapp.com/avatars/184366854674972672/7b008cc762b02513f16a0012a7529de5.png?size=128")


export {
  generateBalance
};