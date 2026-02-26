/**
 * AI 제공자 Enum
 * Prisma의 AIProvider와 호환됩니다.
 */
export const AIProvider = {
	OPENAI: "OPENAI",
	ANTHROPIC: "ANTHROPIC",
} as const;

export type AIProvider = (typeof AIProvider)[keyof typeof AIProvider];

/**
 * AI 제공자 라벨
 */
export const AIProviderLabel: Record<AIProvider, string> = {
	OPENAI: "OpenAI",
	ANTHROPIC: "Anthropic",
};

/**
 * AI 제공자별 기본 모델
 */
export const AIProviderDefaultModel: Record<AIProvider, string> = {
	OPENAI: "gpt-4o",
	ANTHROPIC: "claude-3-5-sonnet-20241022",
};
