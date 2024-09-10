import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';

const createCardCanvas = (width: number, height: number) => {
  return createCanvas(width, height);
};

const drawText = (ctx: any, textArray: any[]) => {
  textArray.forEach(text => {
    ctx.fillStyle = text.color || "#000000";
    ctx.font = `${text.fontSize || 16}px Arial`;
    ctx.fillText(text.content, text.left, text.top);
  });
};

const drawShapes = (ctx: any, shapesArray: any[]) => {
  shapesArray.forEach(shape => {
    ctx.fillStyle = shape.fill || "#000000";
    if (shape.shapeType === "rectangle") { 
      ctx.fillRect(shape.left, shape.top, shape.width, shape.height);
    } else if (shape.shapeType === "circle") { 
      ctx.beginPath();
      ctx.arc(shape.left + shape.radius, shape.top + shape.radius, shape.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  });
};

const drawImages = async (ctx: any, imagesArray: any[]) => {
  for (const image of imagesArray) {
    if (image.url) {
      const img = await loadImage(image.url);
      ctx.drawImage(img, image.left, image.top, image.width, image.height);
    }
  }
};

const sortByZIndex = (elements: any[]) => {
  return elements.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
};

const drawCardSide = async (ctx: any, canvas: any, cardData: any, sideData: any) => {
  clearCanvas(ctx, canvas);

  drawCardTitleAndTheme(ctx, cardData);

  const elements = [
    ...sideData.text.map((t: any) => ({ ...t, type: 'text' })),
    ...sideData.shapes.map((s: any) => ({ ...s, type: 'shape' })),
    ...sideData.images.map((i: any) => ({ ...i, type: 'image' })),
  ];
  const sortedElements = sortByZIndex(elements);

  for (const element of sortedElements) {
    if (element.type === 'text') {
      drawText(ctx, [element]);
    } else if (element.type === 'shape') {
      drawShapes(ctx, [element]);
    } else if (element.type === 'image') {
      await drawImages(ctx, [element]);
    }
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
    const cardWidth = cardData.cardWidth || 300;
    const cardHeight = cardData.cardHeight || 500;

    const canvas = createCardCanvas(cardWidth, cardHeight);
    const ctx = canvas.getContext("2d");

    await drawCardSide(ctx, canvas, cardData, cardData.frontSide);
    const frontImagePath = path.join(__dirname, `../images/${cardData.title}_front.png`);
    saveImageToFile(canvas, frontImagePath);

    clearCanvas(ctx, canvas);

    await drawCardSide(ctx, canvas, cardData, cardData.backSide);
    const backImagePath = path.join(__dirname, `../images/${cardData.title}_back.png`);
    saveImageToFile(canvas, backImagePath);

    return {
      frontImageUrl: `/images/${cardData.title}_front.png`,
      backImageUrl: `/images/${cardData.title}_back.png`,
    };
  } catch (error) {
    throw new Error("Failed to generate card image");
  }
};
