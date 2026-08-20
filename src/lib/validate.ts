import type { InputType } from "./types";

export function validateInput(
  type: InputType,
  content: string,
): string | null {
  const trimmed = content.trim();
  if (!trimmed) {
    if (type === "url") return "Please enter a news article URL.";
    if (type === "text") return "Please paste article text to analyze.";
    return "Please enter a headline to analyze.";
  }
  if (type === "url") {
    try {
      const parsed = new URL(trimmed);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return "Please enter a valid HTTP or HTTPS URL.";
      }
    } catch {
      return "Please enter a valid news article URL.";
    }
  }
  if (type === "text" && trimmed.length < 20) {
    return "Article text is too short. Please paste more content.";
  }
  if (type === "text" && trimmed.length > 15000) {
    return "Article text is too long. Please limit to 15,000 characters.";
  }
  return null;
}
