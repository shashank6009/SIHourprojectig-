// TODO: Phase 3 - Add support for Anthropic and Bedrock providers
export type AIProvider = "openai" | "anthropic" | "bedrock";

export const AI: { provider: AIProvider; model: string } = {
  provider: (process.env.AI_PROVIDER as AIProvider) || "openai",
  model: process.env.AI_MODEL || "gpt-4o-mini", // placeholder, configurable
};
