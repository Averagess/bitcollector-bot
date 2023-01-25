import { createCanvas, loadImage } from "canvas";
import { PlayerInLeaderboard } from "../types";
import { calcMinutesAfterDate, calcMinutesToDate } from "./calcMinutesHelper";
import {NODE_ENV, VERSION} from "./config";

interface generateBalanceParams {
  balance: string;
  cps: string;
  username: string;
  avatarURL: string;
}

interface generateLeaderboardParams {
  players: PlayerInLeaderboard[];
  createdAt: Date;
  nextUpdate: Date;
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

  const bg = await loadImage("./src/resources/backdrop.png")
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

  const stamp = `| ${new Date().toLocaleString("fi-FI")} | ${NODE_ENV} | ${VERSION} |`;

  ctx.fillText(stamp, 200, 375);


  const buffer = canvas.toBuffer("image/png");
  return buffer;
};

const alphabet = "abcdefghijklmnopqrstuvwxyzöäåABCDEFGHIJKLMNOPQRSTUVWXYZöäå".split("");

const generateLeaderboard = async ({players, createdAt, nextUpdate}: generateLeaderboardParams): Promise<Buffer> => {
  const canvas = createCanvas(800, 500);
  const ctx = canvas.getContext("2d");

  const bg = await loadImage("./src/resources/leaderboard.png")
  ctx.drawImage(bg, 0, 0, 800, 500);

  players.forEach((player, index) => {
    if (alphabet.includes(player.discordDisplayName[0])){
      player.discordDisplayName = player.discordDisplayName[0].toUpperCase() + player.discordDisplayName.slice(1);
    }
    const scaledName = scaleName(player.discordDisplayName);
    const balanceReadable = player.balance.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const smartUsernamesize = scaledName.length > 15 ? Math.round(400 / scaledName.length) + "px" : "20px"
    
    if (index < 5) {
      ctx.fillStyle = "#FFFFFF";
      ctx.font = `${36}px Arial`;
      ctx.textAlign = "center";
      ctx.fillText(`${index + 1}.`, 50, 70 + (index * 80));

      ctx.font = `${smartUsernamesize} Arial`;
      ctx.textAlign = "left";
      ctx.fillText(`${scaledName}`, 90, 70 + (index * 80));

      ctx.font = `${smartUsernamesize} Arial`;
      ctx.textAlign = "center";

      ctx.font = `${15}px Arial`;
      
      ctx.fillText("Balance", 50, 90 + (index * 80))
      ctx.textAlign = "left";
      ctx.fillText(`${balanceReadable} Bits`, 90, 90 + (index * 80));
      ctx.textAlign = "center";
      ctx.fillText("CPS", 50, 110 + (index * 80))
      ctx.textAlign = "left";
      ctx.fillText(`${player.cps} Bits/s`, 90, 110 + (index * 80));

    } else {
      ctx.fillStyle = "#FFFFFF";
      ctx.font = `${36}px Arial`;
      ctx.textAlign = "center";
      ctx.fillText(`${index + 1}.`, 500, 70 + ((index - 5) * 80));

      ctx.font = `${smartUsernamesize} Arial`;
      ctx.textAlign = "left";
      ctx.fillText(`${scaledName}`, 540, 70 + ((index - 5) * 80));
      
      ctx.font = `${15}px Arial`;
      ctx.textAlign = "center";

      ctx.fillText("Balance", 500, 90 + ((index - 5) * 80))
      ctx.textAlign = "left";
      ctx.fillText(`${balanceReadable} Bits`, 540, 90 + ((index - 5) * 80));
      ctx.textAlign = "center";
      ctx.fillText("CPS", 500, 110 + ((index - 5) * 80))
      ctx.textAlign = "left";
      ctx.fillText(`${player.cps} Bits/s`, 540, 110 + ((index - 5) * 80));
    }
  })
  ctx.fillStyle = "#808080";
  ctx.font = `${15}px Arial`;
  ctx.textAlign = "center";

  const prettyCreatedAt = calcMinutesAfterDate(createdAt)
  const prettyUpdate = calcMinutesToDate(new Date(), nextUpdate)
  
  ctx.fillText(`Leaderboard updated ${prettyCreatedAt} minutes ago, next update in ${prettyUpdate} minutes`, 400, 470) + " minutes"

  return canvas.toBuffer("image/png");
}

// const save = async () => {
//   const fakeData = new Array(10).fill(0).map(() => ({
//     discordDisplayName: "test",
//     discordId: "o",
//     balance: Math.floor((Math.random() * 1000)).toString(),
//     cps: Math.floor((Math.random() * 1000))
//   }))
//   const buffer = await generateLeaderboard(fakeData, new Date(), new Date())
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   require("fs").writeFileSync("test.png", buffer)
// }
// save()
export {
  generateBalance,
  generateLeaderboard
};