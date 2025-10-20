import Chat, { UserChat, AIChat } from "../models/chat.model.js";
import Project, { File } from "../models/project.model.js";
import aiChat from "../utils/AI.js";

export async function AskAI(req, res) {
  try {
    const { userId, projectId } = req.params;
    const { prompt, fileId } = req.body;

    if (!userId || !projectId || !prompt)
      return res.status(400).json({ message: "Missing Credentials" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project Not Found" });
    const projectObj = {
      project_name: project.project_name,
      project_description: project.project_description,
    };

    let aiResponses;
    let filename="Common";
    if (fileId) {
      const file = await File.findById(fileId);
      if (!file) return res.status(404).json({ message: "No File Found" });
      const fileObj = {
        file_name: file.file_name,
        file_content: file.file_content,
        file_content_documented: file.output_content,
        file_type: file.file_type,
      };
      filename=fileObj.file_name
      aiResponses = await aiChat(
        JSON.stringify(fileObj),
        JSON.stringify(projectObj),
        prompt
      );
    } else {
      aiResponses = await aiChat(
        "",
        JSON.stringify(projectObj),
        prompt
      );
    }
    const userChat=await new UserChat({context:prompt,file_name:filename}).save()
    const aiChatResp=await new AIChat({context:aiResponses,file_name:filename}).save()
    aiChatResp.UserChatId=userChat._id;
    await aiChatResp.save()
    userChat.AIChatId=aiChatResp._id;
    await userChat.save()
    const isChatExist=await Chat.findOne({projectId:projectId})
    
    if(!isChatExist){
      const chat=await new Chat({userId,projectId}).save()
      chat.chats.push({user:userChat._id,ai:aiChatResp._id})
      await chat.save()
    }else{
      isChatExist.chats.push({user:userChat._id,ai:aiChatResp._id})
      await isChatExist.save()
    }
    
    
    res.status(200).json({ message: "Returned", ai: aiResponses });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
}

export async function retrieveChat(req,res){
  try {
    const {projectId}=req.params
    if(!projectId)
      return res.status(400).json({message:"Missing Credentials"})
    const existingChat=await Chat.findOne({projectId})
    if(!existingChat){
      return res.status(404).json({message:"No chat found"})
    }
    let chats=[];
    for(let index=0;index<existingChat.chats.length;index++){
      const element=existingChat.chats[index]
      const users=await UserChat.findById(element.user)
      const ai=await AIChat.findById(element.ai)
      const userContext=users.context
      const aiContext=ai.context
      const userObj={
        prompt:userContext,
        currentFile:users.file_name
      }
      const aiObj={
        ai:aiContext,
        currentFile:ai.file_name
      }
      chats.push(userObj)
      chats.push(aiObj)
    }

    return res.status(200).json({message:"Fetch Successfully",chats})
  } catch (error) {
    res.status(500).json({message:"Internal Server Error",error})
  }
}