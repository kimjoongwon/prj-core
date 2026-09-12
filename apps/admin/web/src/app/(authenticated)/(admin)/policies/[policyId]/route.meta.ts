import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "policies:detail",
		pageLabel: "정책 상세",
		pathPattern: "/policies/[policyId]",
		description: "권한 정책 상세와 포함 Ability를 확인합니다.",
		order: 66,
	},
} satisfies AdminRouteMeta;
