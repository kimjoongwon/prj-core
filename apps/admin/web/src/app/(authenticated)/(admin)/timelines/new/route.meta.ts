import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "timelines",
		groupLabel: "일정 관리",
		pageId: "timelines:new",
		pageLabel: "타임라인 등록",
		pathPattern: "/timelines/new",
		description: "새 타임라인을 등록합니다.",
		order: 11,
	},
} satisfies AdminRouteMeta;
