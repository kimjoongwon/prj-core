import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "tasks",
		groupLabel: "태스크 관리",
		pageId: "tasks:list",
		pageLabel: "태스크 목록",
		pathPattern: "/tasks",
		description: "태스크 목록을 조회합니다.",
		order: 20,
	},
	navItem: {
		id: "tasks-list",
		label: "태스크 목록",
		path: "/tasks",
		subject: "menu:tasks:list",
		order: 1,
		parent: {
			id: "tasks",
			label: "태스크 관리",
			subject: "menu:tasks",
			icon: "Dumbbell",
			order: 5,
		},
	},
} satisfies AdminRouteMeta;
