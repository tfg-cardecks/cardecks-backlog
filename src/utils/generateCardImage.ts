import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import path from "path";
import { validateCardData } from "../validators/validate";

const createCardCanvas = (width: number, height: number) => {
  return createCanvas(width, height);
};

const drawText = (ctx: any, textArray: any[], isBackSide: boolean) => {
  textArray.forEach((text) => {
    ctx.fillStyle = text.color || "#000000";
    ctx.font = `${text.fontSize || 16}px Arial`;
    const lines = wrapText(ctx, text.content, 250, isBackSide);
    lines.forEach((line, index) => {
      ctx.fillText(line, text.left, text.top + index * (text.fontSize || 16));
    });
  });
};

const wrapText = (ctx: any, text: string, maxWidth: number, isBackSide: boolean) => {
  const words = text.split(" ");
  let lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    let word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;

    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);

      if (isBackSide) {
        while (ctx.measureText(word).width > maxWidth) {
          let part = word.slice(0, Math.floor(word.length * maxWidth / ctx.measureText(word).width));
          let partWidth = ctx.measureText(part).width;

          while (partWidth > maxWidth) {
            part = word.slice(0, part.length - 1);
            partWidth = ctx.measureText(part).width;
          }

          lines.push(part);
          word = word.slice(part.length);
        }
      }

      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
};

const drawImages = async (ctx: any, imagesArray: any[]) => {
  for (const image of imagesArray) {
    if (image.url) {
      try {
        const img = await loadImage(image.url);
        ctx.drawImage(img, image.left, image.top, image.width, image.height);
      } catch (error) {
        console.error(`Error al cargar la imagen ${image.url}:`, error);
        throw error;
      }
    }
  }
};

const drawCardSide = async (
  ctx: any,
  canvas: any,
  cardData: any,
  sideData: any,
  side: "front" | "back"
) => {
  clearCanvas(ctx, canvas);

  if (side === "front") {
    drawCardTitleAndTheme(ctx, cardData);
  } else {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (cardData.cardType === "txtImg") {
    if (side === "front") {
      drawText(ctx, sideData.text, false);
    } else if (side === "back") {
      await drawImages(ctx, sideData.images);
    }
  } else if (cardData.cardType === "txtTxt") {
    drawText(ctx, sideData.text, side === "back");
  }
};

const clearCanvas = (ctx: any, canvas: any) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const drawCardTitleAndTheme = (ctx: any, cardData: any) => {
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, 300, 500);

  ctx.fillStyle = "#000000";
  ctx.font = "20px Arial";
  ctx.fillText(cardData.title, 10, 30);
  ctx.font = "16px Arial";
  ctx.fillText(cardData.theme, 10, 60);
};

const saveImageToFile = (canvas: any, imagePath: string) => {
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(imagePath, buffer);
};

export const generateCardImage = async (cardData: any) => {
  try {
    validateCardData(cardData);
    const cardWidth = 300;
    const cardHeight = 500;
    const canvas = createCardCanvas(cardWidth, cardHeight);
    const ctx = canvas.getContext("2d");

    await drawCardSide(ctx, canvas, cardData, cardData.frontSide, "front");
    const frontImagePath = path.join(
      __dirname,
      `../images/${cardData.title}_front.png`
    );
    saveImageToFile(canvas, frontImagePath);
    clearCanvas(ctx, canvas);

    await drawCardSide(ctx, canvas, cardData, cardData.backSide, "back");
    const backImagePath = path.join(
      __dirname,
      `../images/${cardData.title}_back.png`
    );
    saveImageToFile(canvas, backImagePath);

    return {
      frontImageUrl: `/images/${cardData.title}_front.png`,
      backImageUrl: `/images/${cardData.title}_back.png`,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Error al generar la imagen de la carta: ${error.message}`
      );
    } else {
      throw new Error(
        "Error al generar la imagen de la carta: Error desconocido"
      );
    }
  }
};