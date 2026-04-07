import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "tasks",
		groupLabel: "태스크 관리",
		pageId: "tasks:detail",
		pageLabel: "태스크 상세",
		pathPattern: "/tasks/[taskId]/exercise",
		description: "태스크 상세 정보를 확인합니다.",
		order: 22,
	},
} satisfies AdminRouteMeta;
