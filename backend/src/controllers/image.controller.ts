import { Request, Response } from "express";
import { generateImageFromPrompt } from "../services/image.services";

export const generateImage = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const imageUrl = await generateImageFromPrompt(prompt);
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Image generation failed" });
  }
};
