import Project, { File } from "../models/project.model.js";

export async function getProjects(req, res) {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: "Bad request" });

    const projects = await Project.find({ userId: userId });
    
    
    return res
      .status(200)
      .json({ message: "Fetch Data successful", projects });

  } catch (error) {
    return res.status(500).json({message:"Internal Server Error",error})
  }
}


export async function getFiles(req,res){
    try {
        
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"})
    }
}