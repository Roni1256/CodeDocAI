// import { GoogleGenAI, Type } from "@google/genai";
// import { fileContent } from "./dummy.js";

// // The client gets the API key from the environment variable `GEMINI_API_KEY`.
// const ai = new GoogleGenAI({
//   apiKey: "AIzaSyDaomVL4e90hQYiJXoK3o0kTesprfzH84E",
// });

// async function fileAnalyzeBot() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-pro",
//     contents: [
//       {
//         role: "user",
//         parts: [
//           {
//             text: `Analyze the following file content and determine the most suitable type of documentation for it. 
//                     Return a JSON object containing:
//                     {
//                     "documentation_type": "<Type of documentation>",
//                     "reason": "<Why this documentation fits>",
//                     "template": "<Template in markdown format for this type>"
//                     }

//                     File Content:
//                     ${fileContent}
//                 `,
//           },
//         ],
//       },
//     ],
//     config: {
//       systemInstruction: {
//         role: "system",
//         text: `
//             You are "SegregationBot", an expert file analysis AI specializing in software documentation classification. 
//             Your task is to:
//             1. Examine the given file content (code or text).
//             2. Identify what type of documentation is most appropriate for this file.
//             3. Provide a clear, structured JSON object as output with:
//             - documentation_type (string)
//             - reason (string)
//             - template (markdown)

//             Note:You don't have to generate the contents about the file just give the structure

//             Possible documentation types you can choose from:
//             - README (Project-Level Documentation)
//             - API Documentation
//             - Configuration Documentation
//             - Code Architecture / Design Documentation
//             - Test Documentation
//             - Changelog / Version Documentation
//             - License Documentation

//             Be concise, consistent, and accurate. Do not include any text other than the JSON output.
//         `,
//       },
//       responseMimeType: "application/json",
//       responseJsonSchema: {
//         documentation_type: { type: Type.STRING },
//         reason: { type: Type.STRING },
//         template: {
//           type: Type.ARRAY,
//           sections: {
//             type: Type.STRING,
//             enum: [
//               "Introduction",
//               "Overview",
//               "Base URL",
//               "Authentication",
//               "Endpoints",
//               "Request Body",
//               "Response",
//               "Success Response",
//               "Error Response",
//               "Testing Framework",
//               "How to Run Tests",
//               "Test Cases",
//               "Code Architecture",
//               "Modules",
//               "Classes",
//               "Functions",
//               "Changelog",
//               "Version History",
//               "License",
//             ],
//           },
//         },
//       },
//     },
//   });

//   console.log(response.text);
// }

// fileAnalyzeBot();


const x=["a","b","c"]

console.log(x.join());
