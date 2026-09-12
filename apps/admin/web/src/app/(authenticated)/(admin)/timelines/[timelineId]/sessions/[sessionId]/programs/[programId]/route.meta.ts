import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "timelines",
		groupLabel: "일정 관리",
		pageId: "programs:detail",
		pageLabel: "프로그램 상세",
		pathPattern:
			"/timelines/[timelineId]/sessions/[sessionId]/programs/[programId]",
		description: "프로그램 상세 정보를 확인합니다.",
		order: 18,
	},
} satisfies AdminRouteMeta;
