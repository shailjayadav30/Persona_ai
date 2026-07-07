export class ModerationBlockedError extends Error {
  constructor(
    public readonly stage: "input" | "output",
    public readonly reason: string,
  ) {
    super(`Content blocked by moderation (${stage}): ${reason}`);
    this.name = "ModerationBlockedError";
  }
}
