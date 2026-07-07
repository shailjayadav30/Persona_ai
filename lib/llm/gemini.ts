import { PersonaKey } from "@/app/generated/prisma/enums";
import {
  FinishReason,
  GoogleGenAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/genai";
import { personaPrompts } from "../personas";
import { ModerationBlockedError } from "./moderation";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// Blocks medium+ probability harmful content on both the user's input and
// the model's generated output for every one of Gemini's harm categories.
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const BLOCKED_FINISH_REASONS: FinishReason[] = [
  FinishReason.SAFETY,
  FinishReason.PROHIBITED_CONTENT,
  FinishReason.BLOCKLIST,
  FinishReason.SPII,
];

export async function askGemini(
  persona: PersonaKey,
  prompt: string,
): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: personaPrompts[persona],
      safetySettings,
    },
    contents: prompt,
  });

  if (response.promptFeedback?.blockReason) {
    throw new ModerationBlockedError(
      "input",
      response.promptFeedback.blockReason,
    );
  }

  const finishReason = response.candidates?.[0]?.finishReason;
  if (finishReason && BLOCKED_FINISH_REASONS.includes(finishReason)) {
    throw new ModerationBlockedError("output", finishReason);
  }

  if (!response.text) {
    throw new Error("No response from Gemini");
  }
  return response.text;
}
