// utils/validateDescription.ts
export function isValidArchitectureDescription(text: string): {
  valid: boolean;
  reason?: string;
} {
  const trimmed = text.trim().toLowerCase();

  // Empty or too short
  if (trimmed.length < 10) {
    return { valid: false, reason: "Too short. Describe your architecture." };
  }

  // Spam / nonsense patterns
  const spamPatterns = [
    /lorem ipsum/i,
    /test\s*test/i,
    /asdf+/i,
    /fuck/i,
    /shit/i,
    /hello world/i,
    /random text/i,
    /qwerty+/i,
    /123+/i,
    /[^a-z\s]{10,}/, // 10+ non-letter chars = gibberish
  ];

  for (const pattern of spamPatterns) {
    if (pattern.test(trimmed)) {
      return {
        valid: false,
        reason: "Please describe a real software architecture.",
      };
    }
  }

  // Must contain at least ONE architecture keyword
  const archKeywords = [
    "react",
    "next",
    "vue",
    "angular",
    "svelte",
    "node",
    "express",
    "fastapi",
    "django",
    "flask",
    "spring",
    "postgres",
    "mysql",
    "mongodb",
    "redis",
    "kafka",
    "rabbitmq",
    "aws",
    "gcp",
    "azure",
    "docker",
    "kubernetes",
    "terraform",
    "api",
    "backend",
    "frontend",
    "database",
    "cache",
    "auth",
    "oauth",
    "jwt",
  ];

  const hasKeyword = archKeywords.some((keyword) => trimmed.includes(keyword));

  if (!hasKeyword) {
    return {
      valid: false,
      reason:
        "No architecture components detected. Try mentioning React, Node, PostgreSQL, etc.",
    };
  }

  return { valid: true };
}
