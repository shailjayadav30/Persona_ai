import { PersonaKey } from "@/app/generated/prisma/enums";
import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(4000, "Message is too long"),
});

export const personaSchema = z.enum(PersonaKey);
