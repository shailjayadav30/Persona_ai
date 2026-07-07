import { PersonaKey } from "@/app/generated/prisma/enums";
import { hiteshPrompt } from "./hitesh";
import { piyushPrompt } from "./piyush";

export const personaPrompts: Record<PersonaKey, string> = {
  HITESH: hiteshPrompt,
  PIYUSH: piyushPrompt,
};
    