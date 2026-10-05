import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "routines",
		groupLabel: "루틴",
		pageId: "routines:new",
		pageLabel: "루틴 등록",
		pathPattern: "/routines/new",
		description: "새 루틴을 등록합니다.",
		order: 25,
	},
} satisfies AdminRouteMeta;
