import { GoogleGenAI } from "@google/genai";
import User from "../models/user.model.js";
import Project, { File } from "../models/project.model.js";


const ai = new GoogleGenAI({
  apiKey: "AIzaSyDbyry9mSbwXBcLglzi4kArg3u3vF4ZJbw"
});

async function aiGenerate(content,prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: content,
    config:{
      systemInstruction:`
      You are a bot which will convert the given coding files into clear and neat code documentation.
      The documentation should only contain the content and ignore the unwanted and the format is should be in markdown format.
      Have the neat spacing and alignment
      First segregate whether it is a just readme or a api documentation and then proceed.
      The Basic Structure of a README.MD :
      -Project Title & Logo
      -Description (what the project does)
      -Features
      -Installation (step-by-step)
      -Usage (examples, screenshots)
      -API Endpoints (if applicable)
      -Tech Stack
      -Contributing
      -License
      -Contact/Support 
      The Basic Structure of a API Documentation:
      -Base URL
      -Authentication (token, key, etc.)
      -Endpoints
      -Method + URL
      -Description
      -Request body
      -Response body
      -Error codes
      The addition user prompt is ${prompt}
      `,
      thinkingConfig:{
        includeThoughts:true,
        thinkingBudget:32768
      },
      maxOutputTokens:65536
    }
  });
  return response.text
}


export async function generateContent(req, res) {
  try {
    const { project, file = [] } = req.body;
    const {userId}=req.params 
    console.log("Entered Generation");
    if(!userId){
      return res.status(400).json({message:"Bad request"})
    }
    const user=await User.findById(userId)
    if(!user){
      return res.status(404).json({message:"User not found"});
    }

     const newProject=new Project({
      project_name:project.project_name,
      project_description:project.project_description,
      prompt:project.prompt,
      userId:userId
      
    })
    const savedProject=await newProject.save();

    user.projects.push(savedProject._id)
    await user.save();
    

    const userPrompt = project.prompt;
    const resultArray = [];

    console.log("Starting file execution");

    for (let i = 0; i < file.length; i++) {
      const element = file[i];
      console.log(`Executing File number: ${i}`);

      const content = element.fileContent;
      const filename = element.filename;

      try {
        const response = await aiGenerate(content, userPrompt);

        const newFile=new File({
          file_name:filename,
          file_type:element.fileType,
          file_content:content,
          output_content:response,
          projectId:savedProject._id
        })
        const savedFile=await newFile.save();

        savedProject.files.push(savedFile._id);
        await savedProject.save();

        const resultObject = {
          filename: filename,
          content:response,
          id: i
        };

        console.log(`File number-${i}\nContent:`, resultObject);

        resultArray.push(resultObject);
      } catch (error) {
        console.error(`Error generating content for file ${filename}`, error);
        return res.status(501).json({ message: "Something went wrong!" });
      }
    }

    console.log("Storing in the DB");
   
    

    console.log("Sending response");

    


    return res.status(200).json({ message: "Content Generated Successfully", resultArray });

  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ message: "Unable to Generate content", error });
  }
}

export async function saveProject(req,res){
  try {
    const { project} = req.body;
    const {userId}=req.params 
    console.log("Entered Generation");
    if(!userId){
      return res.status(400).json({message:"Bad request"})
    }
    const user=await User.findById(userId)
    if(!user){
      return res.status(404).json({message:"User not found"});
    }

     const newProject=new Project({
      project_name:project.project_name,
      project_description:project.project_description,
      prompt:project.prompt,
      userId:userId
      
    })
    const savedProject=await newProject.save();
    user.projects.push(savedProject._id)
    await user.save();
    return res.status(200).json({message:"Project Saved Successfully",savedProject})
  } catch (error) {
    return res.status(500).json({message:"Internal Server Error",error})
  }
}

export async function generateFile(req,res){
  try {

    const {filename,fileType,fileContent}=req.body;
    const {projectId}=req.params;
    if(!projectId)
      return res.status(401).json({message:"Unauthorized"});
    if(!filename || !fileType || !fileContent)
      return res.status(400).json({message:"Missing Credentials"});
    
  } catch (error) {
    return res.status(500).json({message:"Internal Server Error",error})
  }
}