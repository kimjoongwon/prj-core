import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "routines",
		groupLabel: "루틴",
		pageId: "routines:edit",
		pageLabel: "루틴 수정",
		pathPattern: "/routines/[routineId]/edit",
		description: "루틴 정보를 수정합니다.",
		order: 27,
	},
} satisfies AdminRouteMeta;
