import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "routines",
		groupLabel: "루틴",
		pageId: "routines:list",
		pageLabel: "루틴 목록",
		pathPattern: "/routines",
		description: "루틴 목록을 조회합니다.",
		order: 24,
	},
	navItem: {
		id: "routines-list",
		label: "루틴",
		path: "/routines",
		subject: "menu:routines:list",
		order: 2,
		parent: {
			id: "tasks",
			label: "태스크 관리",
			subject: "menu:tasks",
			icon: "Dumbbell",
			order: 5,
		},
	},
} satisfies AdminRouteMeta;
