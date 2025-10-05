import { Router } from "express";
import { createProject } from "../controllers/project.controller.js";

const route = Router();

route.post("/create", createProject);

export default route;
