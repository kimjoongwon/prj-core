import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "policies:edit",
		pageLabel: "정책 수정",
		pathPattern: "/policies/[policyId]/edit",
		description: "권한 정책 기본 정보와 포함 Ability를 수정합니다.",
		order: 67,
	},
} satisfies AdminRouteMeta;
