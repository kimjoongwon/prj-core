import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "routines",
		groupLabel: "루틴",
		pageId: "routines:detail",
		pageLabel: "루틴 상세",
		pathPattern: "/routines/[routineId]",
		description: "루틴 상세 정보를 확인합니다.",
		order: 26,
	},
} satisfies AdminRouteMeta;
