import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "tasks",
		groupLabel: "태스크 관리",
		pageId: "tasks:new",
		pageLabel: "태스크 등록",
		pathPattern: "/tasks/new",
		description: "새 태스크를 등록합니다.",
		order: 21,
	},
} satisfies AdminRouteMeta;
