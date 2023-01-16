import { createCanvas, loadImage } from "canvas";

const canvas = createCanvas(400, 200);
const ctx = canvas.getContext("2d");


const generateBalance = async (balance: number | string, cps: number | string, username: string): Promise<Buffer> => {
  const balanceReadable = balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const bg = await loadImage("./backdrop-scaled.jpg")
  ctx.drawImage(bg, 0, 0, 400, 200);


  ctx.fillStyle = "#FFFFFF";
  ctx.font = "34px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`${username}'s balance`, 200, 50);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`${balanceReadable}`, 200, 100);

  if(balance.toString().length > 1) {
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`CPS: ${cps}`, 200, 150);
  }




  const buffer = canvas.toBuffer("image/png");
  return buffer;
};



export {
  generateBalance
};