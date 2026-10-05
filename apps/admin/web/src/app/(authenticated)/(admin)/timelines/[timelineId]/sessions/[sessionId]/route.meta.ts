import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "timelines",
		groupLabel: "일정 관리",
		pageId: "sessions:detail",
		pageLabel: "세션 상세",
		pathPattern: "/timelines/[timelineId]/sessions/[sessionId]",
		description: "세션 상세 정보를 확인합니다.",
		order: 15,
	},
} satisfies AdminRouteMeta;
