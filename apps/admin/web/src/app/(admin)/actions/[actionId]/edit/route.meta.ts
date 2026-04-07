import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "actions:edit",
		pageLabel: "액션 수정",
		pathPattern: "/actions/[actionId]/edit",
		description: "액션 정보를 수정합니다.",
		order: 57,
	},
} satisfies AdminRouteMeta;
