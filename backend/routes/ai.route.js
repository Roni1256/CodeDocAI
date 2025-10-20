import { Router } from "express";
import {  generateContent, generateFile, saveProject } from "../controllers/ai.controller.js";

const route=Router();
route.post("/generate-content/:userId",generateContent)
route.post("/save-project/:userId",saveProject);
route.post("/save-file/:projectId",generateFile);
export default route;
