import { createCanvas, loadImage } from "canvas";
import config from "./config";

interface generateBalanceParams {
  balance: string;
  cps: string;
  username: string;
  avatarURL: string;
}

const scaleName = (text: string): string => {
  if(text.length > 20) return text.slice(0, 20) + "...";
  return text;
}

const generateBalance = async ({balance, cps, username, avatarURL}: generateBalanceParams): Promise<Buffer> => {
  const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext("2d");
  
  const scaledName = scaleName(username);
  const balanceReadable = balance.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const cpsReadable = cps.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const bg = await loadImage("./src/utils/backdrop-scaled.png")
  ctx.drawImage(bg, 0, 0, 400, 400);

  const profile = await loadImage(avatarURL);
  ctx.drawImage(profile, 140, 50, 125, 125);

  ctx.fillStyle = "#FFFFFF";
  const smartUsernamesize = scaledName.length > 15 ? Math.round(400 / scaledName.length) + "px" : "34px"
  ctx.font = `${smartUsernamesize} Arial`;
  ctx.textAlign = "center";
  ctx.fillText(`${scaledName}'s balance`, 200, 225);

  ctx.fillStyle = "#FFFFFF";
  const smartBalanceSize = balanceReadable.length > 10 ? "24px" : "28px";
  ctx.font = `${smartBalanceSize} Arial`;
  ctx.textAlign = "center";
  ctx.fillText(`${balanceReadable} Bits`, 200, 275);

  if(balance.length > 1) {
    const smartCpsSize = cpsReadable.length > 10 ? "20px" : "24px";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `${smartCpsSize} Arial`;
    ctx.textAlign = "center";
    ctx.fillText(`CPS: ${cpsReadable} bits/s`, 200, 325);
  }

  ctx.fillStyle = "#808080";
  ctx.font = "10px Arial";
  ctx.textAlign = "center";

  const stamp = `| ${new Date().toLocaleString("fi-FI")} | ${config.NODE_ENV} | ${config.VERSION} |`;

  ctx.fillText(stamp, 200, 395);


  const buffer = canvas.toBuffer("image/png");
  return buffer;
};

export {
  generateBalance
};