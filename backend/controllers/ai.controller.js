import { GoogleGenAI } from "@google/genai";
import User from "../models/user.model.js";
import Project, { File } from "../models/project.model.js";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyDbyry9mSbwXBcLglzi4kArg3u3vF4ZJbw",
});

export async function aiGenerate(content, prompt = "") {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Analyze the following file content and determine the most suitable type of documentation for it. 
                        Return a JSON object containing:
                        {
                        "documentation_type": "<Type of documentation>",
                        "reason": "<Why this documentation fits>",
                        "template": "<Template in markdown format for this type>"
                        }
    
                        File Content:
                        ${content}
                    `,
          },
        ],
      },
    ],
    config: {
      systemInstruction: `
       You are "SegregationBot", an expert file analysis AI specializing in software documentation classification. 
            Your task is to:
            1. Examine the given file content (code or text).
            2. Identify what type of documentation is most appropriate for this file.
            3. Provide a clear, structured JSON object as output with:
            - documentation_type (string)
            - reason (string)
            - template (markdown)

            Possible documentation types you can choose from:
            - README (Project-Level Documentation)
            - API Documentation
            - Configuration Documentation
            - Code Architecture / Design Documentation
            - Test Documentation
            - Changelog / Version Documentation
            - License Documentation

            Be concise, consistent, and accurate. Do not include any text other than the JSON output.
      The addition user prompt is ${prompt}
      `,
      thinkingConfig: {
        includeThoughts: true,
        thinkingBudget: 32768,
      },
      maxOutputTokens: 65536,
      responseMimeType:"application/json",
      responseSchema:{
        
      }
    },
  });
  return response.text;
}

export async function generateContent(req, res) {
  try {
    const { project, file = [] } = req.body;
    const { userId } = req.params;
    console.log("Entered Generation");
    if (!userId) {
      return res.status(400).json({ message: "Bad request" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newProject = new Project({
      project_name: project.project_name,
      project_description: project.project_description,
      prompt: project.prompt,
      userId: userId,
    });
    const savedProject = await newProject.save();

    user.projects.push(savedProject._id);
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

        const newFile = new File({
          file_name: filename,
          file_type: element.fileType,
          file_content: content,
          output_content: response,
          projectId: savedProject._id,
        });
        const savedFile = await newFile.save();

        savedProject.files.push(savedFile._id);
        await savedProject.save();

        const resultObject = {
          filename: filename,
          content: response,
          id: i,
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

    return res
      .status(200)
      .json({ message: "Content Generated Successfully", resultArray });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res
      .status(500)
      .json({ message: "Unable to Generate content", error });
  }
}

export async function saveProject(req, res) {
  try {
    const { project_name, project_description, prompt } = req.body;
    const { userId } = req.params;
    console.log("Entered Generation");
    if (!userId) {
      return res.status(400).json({ message: "Bad request" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newProject = new Project({
      project_name,
      project_description,
      prompt,
      userId,
    });
    const savedProject = await newProject.save();
    user.projects.push(savedProject._id);
    await user.save();
    return res
      .status(200)
      .json({ message: "Project Saved Successfully", savedProject });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}

export async function generateFile(req, res) {
  try {
    console.log(req.body);

    const { element, prompt } = req.body;
    const filename = element.filename;
    const fileType = element.fileType;
    const fileContent = element.fileContent;
    const { projectId } = req.params;
    if (!projectId) return res.status(401).json({ message: "Unauthorized" });
    const project = await Project.findById(projectId);
    if (!filename || !fileType || !fileContent)
      return res.status(400).json({ message: "Missing Credentials" });
    const output_response = await aiGenerate(fileContent, prompt);
    const saveFileObj = {
      file_name: filename,
      file_type: fileType,
      file_content: fileContent,
      output_content: output_response,
      projectId: projectId,
    };
    const newFile = new File(saveFileObj);
    const savedFile = await newFile.save();
    project.files.push(savedFile._id);
    await project.save();

    return res
      .status(201)
      .json({ message: `${filename} generated successfully`, savedFile });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}
