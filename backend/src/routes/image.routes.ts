import express from "express";
import { generateImage } from "../controllers/image.controller";
import userAuth from "../middleware/image.middleware";

const router = express.Router();
router.post("/generate", userAuth, generateImage);

export default router;
