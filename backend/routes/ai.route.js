import { Router } from "express";
import { generateContent } from "../controllers/ai.controller.js";

const route=Router();
route.post("/generate-content/:userId",generateContent)

export default route;
