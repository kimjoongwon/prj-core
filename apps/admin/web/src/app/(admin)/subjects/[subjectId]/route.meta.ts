import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "roles",
		groupLabel: "권한 관리",
		pageId: "subjects:detail",
		pageLabel: "대상 상세",
		pathPattern: "/subjects/[subjectId]",
		description: "대상 상세 정보를 확인합니다.",
		order: 59,
	},
} satisfies AdminRouteMeta;
