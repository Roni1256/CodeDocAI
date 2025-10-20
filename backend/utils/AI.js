import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
  apiKey: "AIzaSyDaomVL4e90hQYiJXoK3o0kTesprfzH84E",
});



export default async function aiChat(
  FileContent = "",
  project = "",
  prompt = ""
) {
  // Helper: Split large text into manageable chunks
  function chunkText(text, chunkSize = 2000) {
    if (!text) return [];
    const chunks = [];
    let start = 0;
    while (start < text.length) {
      chunks.push(text.slice(start, start + chunkSize));
      start += chunkSize;
    }
    return chunks;
  }

  // Prepare context chunks
  const projectChunks = chunkText(project);
  const fileChunks = chunkText(FileContent);

  // Combine all chunks into a single context string
  const contextChunks = [...projectChunks, ...fileChunks]
    .map((chunk, idx) => {
      return `CHUNK ${idx + 1}:\n${chunk}`;
    })
    .join("\n\n");

  // Create the RAG-style prompt
  const ragPrompt = `
You are a RAG-style AI assistant for software projects and code.

Use ONLY the following data to answer the user's question. Never guess, assume, or use knowledge outside this data until the user asks. 
If the answer is not present, respond naturally with: "I don’t see that information in the current data."

DATA CHUNKS:
${contextChunks}

USER QUESTION:
${prompt}

Instructions:
- Retrieve relevant parts from the chunks to answer.
- Default to short, clear, and direct answers.
- Provide detailed explanations only if explicitly requested.
- Focus on purpose, logic, and structure.
- Respond with markdown for better readability.
  `;

  // Call the AI model
  const response = await ai.models.generateContentStream({
    model: "gemini-2.5-pro",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: ragPrompt,
          },
        ],
      },
    ],
    config: {
      systemInstruction: {
        text: `
You are a RAG-style AI assistant for software projects and code.
- Only use the provided data chunks to answer questions.
- Never hallucinate or rely on outside knowledge.
- Retrieve relevant chunks and summarize/explain as needed.
- Respond concisely by default; detailed only if asked.
- Focus on logic, purpose, and structure.
- If information is missing, reply: "I don’t see that information in the current data."
- Respond in markdown for better readability.
        `,
      },
      temperature: 0.5,
      topP: 0.8,
      thinkingConfig: {
        thinkingBudget: 12000, // higher budget for larger content
      },
    },
  });

  // Collect streaming response
  let responseText = "";
  for await (const chunk of response) {
    responseText += chunk.text;
  }

  return responseText;
}


