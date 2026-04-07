import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "timelines",
		groupLabel: "일정 관리",
		pageId: "timelines:list",
		pageLabel: "타임라인 목록",
		pathPattern: "/timelines",
		description: "타임라인 목록을 조회합니다.",
		order: 10,
	},
	navItem: {
		id: "timelines-list",
		label: "타임라인",
		path: "/timelines",
		subject: "menu:timelines:list",
		order: 1,
		parent: {
			id: "timelines",
			label: "일정 관리",
			subject: "menu:timelines",
			icon: "CalendarDays",
			order: 4,
		},
	},
} satisfies AdminRouteMeta;
