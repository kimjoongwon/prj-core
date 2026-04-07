import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "timelines",
		groupLabel: "일정 관리",
		pageId: "programs:new",
		pageLabel: "프로그램 등록",
		pathPattern: "/timelines/[timelineId]/sessions/[sessionId]/programs/new",
		description: "세션에 새 프로그램을 추가합니다.",
		order: 17,
	},
} satisfies AdminRouteMeta;
