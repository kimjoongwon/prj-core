/**
 * AI 템플릿 상태 Enum
 * Prisma의 AITemplateStatus와 호환됩니다.
 */
export const AITemplateStatus = {
	DRAFT: "DRAFT",
	ACTIVE: "ACTIVE",
	INACTIVE: "INACTIVE",
	ARCHIVED: "ARCHIVED",
} as const;

export type AITemplateStatus =
	(typeof AITemplateStatus)[keyof typeof AITemplateStatus];

/**
 * AI 템플릿 상태 라벨
 */
export const AITemplateStatusLabel: Record<AITemplateStatus, string> = {
	DRAFT: "초안",
	ACTIVE: "활성",
	INACTIVE: "비활성",
	ARCHIVED: "보관",
};
