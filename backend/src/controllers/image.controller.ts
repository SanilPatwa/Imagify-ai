import { Request, Response } from "express";
import { generateImageFromPrompt } from "../services/image.services";

export const generateImage = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const imageUrl = generateImageFromPrompt(prompt.trim());
    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("generateImage error:", error);
    return res.status(500).json({ message: "Image generation failed" });
  }
};
