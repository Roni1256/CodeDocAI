import Project, { File } from "../models/project.model.js";
import User from "../models/user.model.js";
import documentationGeneratorBot from "../utils/DocumentationBot.js";
import { aiGenerate } from "./ai.controller.js";
import Chat,{UserChat,AIChat} from  "../models/chat.model.js"

export async function getProjects(req, res) {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: "Bad request" });

    const projects = await Project.find({ userId: userId });

    return res.status(200).json({ message: "Fetch Data successful", projects });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}

export async function getFile(req, res) {
  try {
    const { fileId } = req.params;
    console.log(fileId);

    if (!fileId) return res.status(400).json({ message: "Bad Request" });

    const file = await File.findById(fileId);

    if (!file) return res.status(404).json({ message: "File not found" });

    return res.status(200).json({ message: "File Fetch Successfully", file });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteProject(req, res) {
  try {
    const { userId, projectId } = req.params;
    if (!userId || !projectId) {
      return res.status(400).json({ message: "Missing Credentials" });
    }
    const project = await Project.findOneAndDelete({
      userId: userId,
      _id: projectId,
    });
    const chat=await Chat.findOneAndDelete({projectId})
    for(let index=0;index<chat.chats;index++){
      const element=chat.chats(index)
      await UserChat.findByIdAndDelete(element.user)
      await AIChat.findByIdAndDelete(element.ai)
    }
    if (!project) {
      return res.status(404).json({ message: "Project Not Exists" });
    }
    return res.status(204).json({ message: "Project Deleted Successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}

export async function editProject(req, res) {
  try {
    const { projectId } = req.params;
    const { project_name, project_description } = req.body;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project Not Found" });
    project.project_name = project_name ? project_name : project.project_name;
    project.project_description = project_description
      ? project_description
      : project.project_description;
    project.save();
    return res.status(200).json({ message: "Updated Successfully!" });
  } catch (error) {}
}

export async function editFileContent(req, res) {
  try {
    const { fileId } = req.params;
    const { file_content } = req.body;

    const file = await File.findById(fileId);
    file.file_content = file_content;
    const response = await aiGenerate(file_content);
    file.output_content = response;
    const savedFile = await file.save();
    return res
      .status(200)
      .json({ message: "File Saved SuccessFully", savedFile });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}

export async function editDocumentContent(req, res) {
  try {
    const { fileId } = req.params;
    const { output_content } = req.body;
    const file = await File.findById(fileId);
    file.output_content = output_content;
    const savedDocument = await file.save();
    return res
      .status(200)
      .json({ message: "Document Saved Successfully", savedDocument });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}
export async function deleteFile(req, res) {
  try {
    const { fileId, projectId } = req.params;
    if (!fileId || !projectId)
      return res.status(400).json({ message: "Missing Credentials" });
    const project = await Project.findById(projectId);

    project.files = project.files.filter((element) => element != fileId);
    await project.save();
    const file = await File.findByIdAndDelete(fileId);

    return res.status(202).json({ message: "File Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}

export async function getFiles(req, res) {
  try {
    const { projectId } = req.params;
    const { files } = req.body;
    if (!files || !projectId) {
      return res.status(400).json({ message: "Missing Credentials" });
    }
    let response = [];

    const file = await File.find({ projectId });
    
    console.log(file);
    
    return res
      .status(200)
      .json({ message: "Files Fetch Successfully", files: file });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server error", error });
  }
}

export async function addNewFile(req,res){
  try {
    const {projectId}=req.params
    const {file}=req.body
    const file_name=file.file_name
    const file_content=file.file_content
    const file_type=file.file_type
    console.log(file_content);
    
    const output_content=await documentationGeneratorBot(file_content,file_name)
    
    const project=await Project.findById(projectId)
    if(!project)
      return res.status(404).json({message:"Project Not Found"})
    const newFile=new File({file_name,file_content,file_type,output_content,projectId})
    const saveFile=await newFile.save();
    project.files.push(saveFile._id);
    await project.save();
    return res.status(200).json({message:"File Saved Successfully",file:saveFile})
  } catch (error) {
    
  }
}
export async function addNewProject(req,res){
  try {
    const {userId}=req.params
    const {project_name,project_description}=req.body
    if(!userId)
      return res.status(401).json({message:"Unauthorized Access"})
    if(!project_name || !project_description){
      return res.status(400).json({message:"Missing Credentials"})
    }
    const user=await User.findById(userId)
    if(!user)
      return res.status(404).json({message:"User not found"})
    const newProject=new Project({project_name,project_description,files:[],userId});
    const savedProject=await newProject.save();
    return res.status(200).json({message:"New project created successfully.",savedProject})
  } catch (error) {
    
  }
}