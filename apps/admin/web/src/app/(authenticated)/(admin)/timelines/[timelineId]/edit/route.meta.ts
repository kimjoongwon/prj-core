import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "timelines",
		groupLabel: "일정 관리",
		pageId: "timelines:edit",
		pageLabel: "타임라인 수정",
		pathPattern: "/timelines/[timelineId]/edit",
		description: "타임라인 정보를 수정합니다.",
		order: 13,
	},
} satisfies AdminRouteMeta;
