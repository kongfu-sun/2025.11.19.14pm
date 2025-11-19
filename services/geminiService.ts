import { GoogleGenAI, Type } from "@google/genai";
import { GameTheme } from "../types";

// Ensure API KEY is present in the environment
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateGameTheme = async (prompt: string): Promise<GameTheme> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Cannot generate theme.");
  }

  const modelId = 'gemini-2.5-flash';
  
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Create a color theme for a Snake game based on this description: "${prompt}". 
      Ensure high contrast and visibility. The output must be valid JSON matching the schema.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "A creative name for the theme" },
            backgroundColor: { type: Type.STRING, description: "Hex code for the board background" },
            gridColor: { type: Type.STRING, description: "Hex code for grid lines (subtle)" },
            snakeHeadColor: { type: Type.STRING, description: "Hex code for the snake head" },
            snakeBodyColor: { type: Type.STRING, description: "Hex code for the snake body" },
            foodColor: { type: Type.STRING, description: "Hex code for the food glow" },
            foodEmoji: { type: Type.STRING, description: "A single emoji representing the food" },
            textColor: { type: Type.STRING, description: "Hex code for text/UI elements that contrasts with background" }
          },
          required: ["name", "backgroundColor", "gridColor", "snakeHeadColor", "snakeBodyColor", "foodColor", "foodEmoji", "textColor"]
        }
      }
    });

    if (response.text) {
      const theme = JSON.parse(response.text) as GameTheme;
      return theme;
    } else {
      throw new Error("No text returned from Gemini");
    }
  } catch (error) {
    console.error("Theme generation failed:", error);
    // Fallback theme in case of error
    return {
      name: "Error Fallback",
      backgroundColor: "#1f2937",
      gridColor: "#374151",
      snakeHeadColor: "#ef4444",
      snakeBodyColor: "#f87171",
      foodColor: "#10b981",
      foodEmoji: "🍎",
      textColor: "#f3f4f6"
    };
  }
};