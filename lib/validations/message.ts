import { z } from "zod";

export const messageSchema = z.object({
  content: z.string().trim().max(4000).min(1),
  persona: z.enum(["HITESH", "PIYUSH"]),
});
