/**
 * Classifies whether an error message indicates a configuration/API-key
 * problem (which means we can fall back to demo mode) vs. a real analysis
 * failure (which should show the error to the user).
 */
export function isConfigurationError(errorMessage: string): boolean {
  const msg = errorMessage.toLowerCase();
  return (
    msg.includes("api key not configured") ||
    msg.includes("not configured") ||
    msg.includes("invalid api key") ||
    msg.includes("403") ||
    msg.includes("401")
  );
}

/**
 * Returns a user-friendly message for configuration errors.
 */
export function getConfigErrorMessage(): string {
  return "API key not configured. Set your GEMINI_API_KEY in .env, or try a demo below.";
}

/**
 * Maps input types to demo keys for fallback.
 */
export function getDemoKeyForInputType(
  inputType: "url" | "text" | "headline",
): string {
  switch (inputType) {
    case "url":
      return "true";
    case "headline":
      return "false";
    case "text":
      return "misleading";
  }
}
