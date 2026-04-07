import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "actions:new",
		pageLabel: "액션 등록",
		pathPattern: "/actions/new",
		description: "새 액션을 등록합니다.",
		order: 55,
	},
} satisfies AdminRouteMeta;
