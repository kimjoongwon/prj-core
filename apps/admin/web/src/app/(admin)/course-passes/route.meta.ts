import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "courses",
		groupLabel: "수강 관리",
		pageId: "course-passes:list",
		pageLabel: "CoursePass",
		pathPattern: "/course-passes",
		description: "수강권의 유효기간과 잔여 예약 권리를 관리합니다.",
		order: 74,
	},
	navItem: {
		id: "course-passes-list",
		label: "CoursePass",
		path: "/course-passes",
		subject: "menu:course-passes:list",
		order: 4,
		parent: {
			id: "courses",
			label: "수강 관리",
			subject: "menu:courses",
			icon: "Ticket",
			order: 13,
		},
	},
} satisfies AdminRouteMeta;
