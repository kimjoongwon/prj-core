/**
 * 정렬 순서를 나타내는 Enum
 * Prisma의 SortOrder와 호환됩니다.
 */
export const SortOrder = {
  asc: "asc",
  desc: "desc",
} as const;

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
