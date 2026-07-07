import { PersonaKey } from "@/app/generated/prisma/enums";
import { guardrailsPrompt } from "./guardrails";
import { hiteshPrompt } from "./hitesh";
import { piyushPrompt } from "./piyush";

export const personaPrompts: Record<PersonaKey, string> = {
  HITESH: `${hiteshPrompt}\n${guardrailsPrompt}`,
  PIYUSH: `${piyushPrompt}\n${guardrailsPrompt}`,
};
