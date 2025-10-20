import { Router } from "express";
import {
  deleteProject,
  editProject,
  getFile,
  getProjects,
  editFileContent,
  editDocumentContent,
  deleteFile,
  getFiles,
  addNewFile,
  addNewProject,
} from "../controllers/project.controller.js";

const route = Router();

route.get("/get/:userId", getProjects);
route.get("/get-file/:fileId", getFile);
route.delete("/delete/:userId/:projectId", deleteProject);
route.put("/update/:projectId", editProject);
route.put("/save/code/:fileId", editFileContent);
route.put("/save/document/:fileId", editDocumentContent);
route.delete("/delete/file/:projectId/:fileId", deleteFile);
route.post("/get-files/:projectId", getFiles);
route.post("/add-file/:projectId", addNewFile);
route.post("/add-project/:userId", addNewProject);
export default route;
