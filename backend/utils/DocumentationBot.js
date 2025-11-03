import { GoogleGenAI, Type } from "@google/genai";
const ai = new GoogleGenAI({
  apiKey: "AIzaSyDaomVL4e90hQYiJXoK3o0kTesprfzH84E",
});



export default async function documentationGeneratorBot(fileContent,file_name) {
  console.log("Entered to Analyzer");

  const documentationGeneratorBot_System = `You are "documentationGenerationBot", an AI specialized in software documentation generation and classification.

Your task:
1. Examine the provided file content.
2. Identify the most appropriate type of documentation.
3. Return a JSON object strictly following this schema:

{
  "documentation_type": "string",
  "reason": "string",
  "template": [
    {
      "section_name": "string (one of the allowed sections)",
      "content": "string (markdown content for this section)"
    }
  ],
  "documentation": "string (fully generated markdown documentation following the template)"
}
Note title is always the Filename:${file_name}
Allowed section names for "template":
-Title
- Introduction
- Overview
- Base URL
- Authentication
- Endpoints
- Request Body
- Response
- Success Response
- Error Response
- Testing Framework
- How to Run Tests
- Test Cases
- Code Architecture
- Modules
- Classes
- Functions
- Changelog
- Version History
- License

Requirements:
- "documentation_type" must be one of:
  README, API Documentation, Configuration Documentation, Code Architecture / Design Documentation, Test Documentation, Changelog / Version Documentation, License Documentation.
- "reason" explains why the chosen documentation type fits the file.
- "template" is an array of objects, each with:
  - "section_name": the section to include.
  - "content": markdown content for that section.
- "documentation" is mandatory and must contain the fully generated markdown documentation based on the "template".

Output only valid JSON — no explanations, commentary, or extra text.
`;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Analyze the following file content and determine the most suitable type of documentation for it.
Return a JSON object strictly following this structure:

{
  "documentation_type": "<Type of documentation>",
  "reason": "<Why this documentation fits>",
  "template": [
    {
      "section_name": "<Name of the section>",
      "content": "<Markdown content for this section>"
    }
  ],
  "documentation": "<Fully generated markdown documentation based on the template >"
}

File Content:
${fileContent}

`,
          },
        ],
      },
    ],
    config: {
      systemInstruction: {
        role: "system",
        text: documentationGeneratorBot_System,
      },
      responseMimeType: "application/json",
      responseJsonSchema: {
        type: Type.OBJECT,
        properties: {
          documentation_type: { type: Type.STRING },
          reason: { type: Type.STRING },
          template: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                section_name: {
                  type: Type.STRING,
                  enum: [
                    "Title",
                    "Introduction",
                    "Overview",
                    "Base URL",
                    "Authentication",
                    "Endpoints",
                    "Request Body",
                    "Response",
                    "Success Response",
                    "Error Response",
                    "Testing Framework",
                    "How to Run Tests",
                    "Test Cases",
                    "Code Architecture",
                    "Modules",
                    "Classes",
                    "Functions",
                    "Changelog",
                    "Version History",
                    "License",
                  ],
                },
                content: { type: Type.STRING },
              },
              required: ["section_name", "content"],
            },
          },
          documentation: { type: Type.STRING },
        },
        propertyOrdering: [
          "documentation_type",
          "reason",
          "template",
          "documentation",
        ],
        required: ["documentation_type", "reason", "template", "documentation"],
      },
    },
  });

  console.log(response.text);
  const responseObj = JSON.parse(response.text);

  return responseObj.documentation;
}