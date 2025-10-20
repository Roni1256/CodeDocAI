import express from 'express'
import { GoogleGenAI, Type } from "@google/genai";
export const fileContent=`# sample_test.py

import unittest
from calculator import add, subtract, multiply, divide

class TestCalculator(unittest.TestCase):

    def test_add(self):
        self.assertEqual(add(2, 3), 5)
        self.assertEqual(add(-1, 1), 0)

    def test_subtract(self):
        self.assertEqual(subtract(10, 5), 5)
        self.assertEqual(subtract(0, 0), 0)

    def test_multiply(self):
        self.assertEqual(multiply(3, 7), 21)
        self.assertEqual(multiply(-1, 5), -5)

    def test_divide(self):
        self.assertEqual(divide(10, 2), 5)
        self.assertRaises(ZeroDivisionError, divide, 5, 0)

if __name__ == '__main__':
    unittest.main()

`
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

Allowed section names for "template":
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
// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
  apiKey: "AIzaSyDaomVL4e90hQYiJXoK3o0kTesprfzH84E",
});

async function generatorBot(returnedAnalysis){
    const response=await ai.models.generateContent({
        model:"gemini-2.5-pro",
        contents:{
            role:"user",
            text:`
            File Name:${"File-1"}
            File Content:${fileContent}
            Required Documentation Type:${returnedAnalysis.documentation_type}
            Reason for Documentation Type:${returnedAnalysis.reason}
            Documentation Template:${returnedAnalysis.template.join()}

            Analyze the following file content and consider the provided data and return the document with the provided template.
             Note:Only return the documentation of the file.
            `
        }


    })

    console.log(response.text);
    
    return response.text

}
export async function fileAnalyzeBot(req,res) {
  console.log("Entered to Analyzer");

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
  "documentation": "<Fully generated markdown documentation based on the template>"
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

  res.status(200).json(responseObj)
}


const route=express.Router();

route.get('/sample',fileAnalyzeBot)

export default route;