import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "timelines",
		groupLabel: "일정 관리",
		pageId: "sessions:new",
		pageLabel: "세션 등록",
		pathPattern: "/timelines/[timelineId]/sessions/new",
		description: "타임라인에 새 세션을 추가합니다.",
		order: 14,
	},
} satisfies AdminRouteMeta;
