import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "timelines",
		groupLabel: "일정 관리",
		pageId: "sessions:edit",
		pageLabel: "세션 수정",
		pathPattern: "/timelines/[timelineId]/sessions/[sessionId]/edit",
		description: "세션 정보를 수정합니다.",
		order: 16,
	},
} satisfies AdminRouteMeta;
