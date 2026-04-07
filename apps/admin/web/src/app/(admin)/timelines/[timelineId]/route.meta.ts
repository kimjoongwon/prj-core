import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "timelines",
		groupLabel: "일정 관리",
		pageId: "timelines:detail",
		pageLabel: "타임라인 상세",
		pathPattern: "/timelines/[timelineId]",
		description: "타임라인 상세 정보를 확인합니다.",
		order: 12,
	},
} satisfies AdminRouteMeta;
