
import { GoogleGenAI } from "@google/genai";

// Fix: Per coding guidelines, assume process.env.API_KEY is always available and use it directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const suggestMessage = async (documentName: string): Promise<string> => {
  try {
    const prompt = `Generate a short, professional, and friendly message to accompany a document signature request. The document is called "${documentName}". The message should be a single paragraph.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating message with Gemini:", error);
    return "Please review and sign the attached document at your earliest convenience.";
  }
};
