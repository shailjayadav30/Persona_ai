const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /disregard\s+(all\s+)?previous\s+instructions/i,
  /reveal\s+(the\s+)?system\s+prompt/i,
  /show\s+hidden\s+instructions/i,
  /repeat\s+your\s+system\s+prompt/i,
  /developer\s+message/i,
  /developer\s+instructions/i,
  /system\s+prompt/i,
  /print\s+your\s+instructions/i,
  /you\s+are\s+now/i,
  /act\s+as/i,
];

export function detectPromptInjection(input: string): string | null {
  const match = PROMPT_INJECTION_PATTERNS.find((pattern) =>
    pattern.test(input),
  );
  return match ? match.source : null;
}


export class ModerationBlockedError extends Error {
  constructor(
    public readonly stage: "input" | "output",
    public readonly reason: string,
  ) {
    super(`Content blocked by moderation (${stage}): ${reason}`);
    this.name = "ModerationBlockedError";
  }
}
