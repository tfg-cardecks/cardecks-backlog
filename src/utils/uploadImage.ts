import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { Card } from "../models/card";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
});

export const uploadCardImage = async (req: Request, res: Response) => {
  const { id } = req.params;

  const img = req.file;
  const { side, left, top, width, height, url } = req.body as {
    side: "frontSide" | "backSide";
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    url?: string;
  };

  if (!img && !url)
    return res.status(400).json({ message: "Image or URL is required" });

  if (!side || !["frontSide", "backSide"].includes(side)) {
    return res
      .status(400)
      .json({ message: "Invalid or missing side parameter" });
  }
  try {
    const card = await Card.findById(id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const imageEntry: any = {
      left: left ? Number(left) : undefined,
      top: top ? Number(top) : undefined,
      width: width ? Number(width) : undefined,
      height: height ? Number(height) : undefined,
    };

    if (img) {
      imageEntry.dataFile = img.buffer;
      imageEntry.contentType = img.mimetype;
    }

    if (url) imageEntry.url = url;

    (card[side] as any).images.push(imageEntry);

    await card.save();
    return res
      .status(200)
      .json({ message: "Image uploaded successfully", img });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const errorHandlingFiles = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: "Unexpected field in the request" });
  }
  next();
};
