import { GoogleGenAI, Type } from "@google/genai";
import { ContentIdea } from "../types";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

const MODEL_NAME = 'gemini-2.5-flash';

export const generateContentIdeas = async (
  promptText: string,
  audioBase64?: string,
  mimeType?: string
): Promise<ContentIdea[]> => {
  try {
    const parts: any[] = [];

    // Add audio if available
    if (audioBase64 && mimeType) {
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: audioBase64,
        },
      });
      parts.push({
        text: "Please listen to this audio idea carefully."
      });
    }

    // Add the user's text prompt or a default instruction if only audio is provided
    const userPrompt = promptText || "Generate content ideas based on the input.";
    parts.push({
      text: `${userPrompt}

      Task: Generate 5 creative and engaging social media content ideas in Burmese (Myanmar Language) based on the input provided.
      The tone should be professional yet engaging.
      
      Return the response in a structured JSON format.
      For each idea, provide:
      1. 'title': A catchy headline in Burmese.
      2. 'content': The main body copy in Burmese (ready to post).
      3. 'hashtags': Relevant hashtags in Burmese/English.`
    });

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: parts,
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              hashtags: { type: Type.STRING }
            },
            required: ["title", "content", "hashtags"]
          }
        }
      }
    });

    if (response.text) {
      const parsedData = JSON.parse(response.text);
      return parsedData as ContentIdea[];
    }

    return [];
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};