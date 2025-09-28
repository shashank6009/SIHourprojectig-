// TODO: Phase 2 - Move to feature flag service for dynamic toggling
export const flags = {
  RESUME_COPILOT_ENABLED: process.env.RESUME_COPILOT_ENABLED === "true" || process.env.NODE_ENV === "development",
};
