import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "timelines",
		groupLabel: "일정 관리",
		pageId: "programs:edit",
		pageLabel: "프로그램 수정",
		pathPattern:
			"/timelines/[timelineId]/sessions/[sessionId]/programs/[programId]/edit",
		description: "프로그램 정보를 수정합니다.",
		order: 19,
	},
} satisfies AdminRouteMeta;
