import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "tasks",
		groupLabel: "태스크 관리",
		pageId: "tasks:edit",
		pageLabel: "태스크 수정",
		pathPattern: "/tasks/[taskId]/exercise/edit",
		description: "태스크 정보를 수정합니다.",
		order: 23,
	},
} satisfies AdminRouteMeta;
