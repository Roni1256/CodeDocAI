import { Router } from "express";
import { getProjects } from "../controllers/project.controller.js";

const route = Router();

route.get("/get/:userId", getProjects);

export default route;
