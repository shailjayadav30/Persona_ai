import { PersonaKey } from "@/app/generated/prisma/enums";
import { GoogleGenAI } from "@google/genai";
import { personaPrompts } from "../personas";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function askGemini(
  persona: PersonaKey,
  prompt: string,
): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: personaPrompts[persona],
    },
    contents: prompt,
  });

  if (!response.text) {
    throw new Error("No response from Gemini");
  }
  return response.text;
}
