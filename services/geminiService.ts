
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeStory = async (title: string, description: string): Promise<AIAnalysis> => {
  const prompt = `Analyze the following agile user story and provide a story point estimation based on the Fibonacci sequence (0, 0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89). 
  Consider complexity, uncertainty, and effort.
  
  Story Title: ${title}
  Story Description: ${description}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedPoints: {
              type: Type.STRING,
              description: "The suggested Fibonacci point (e.g., '5', '8')."
            },
            reasoning: {
              type: Type.STRING,
              description: "Brief explanation for the score."
            },
            risks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Potential technical risks or dependencies."
            },
            complexityScore: {
              type: Type.NUMBER,
              description: "A complexity score from 1 to 10."
            }
          },
          required: ["suggestedPoints", "reasoning", "risks", "complexityScore"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
