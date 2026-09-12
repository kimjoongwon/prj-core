import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "actions:detail",
		pageLabel: "액션 상세",
		pathPattern: "/actions/[actionId]",
		description: "액션 상세 정보를 확인합니다.",
		order: 56,
	},
} satisfies AdminRouteMeta;
