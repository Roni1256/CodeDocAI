import { Router } from "express";
import { AskAI, retrieveChat } from "../controllers/chat.controller.js";

const route=Router();

route.post("/ask-ai/:userId/:projectId",AskAI)
route.get("/get-chats/:projectId",retrieveChat)


export default route;