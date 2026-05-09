import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "courses",
		groupLabel: "수강 관리",
		pageId: "course-offerings:list",
		pageLabel: "CourseOffering",
		pathPattern: "/course-offerings",
		description: "실제 개설된 과정/반/기수와 Timeline 연결을 관리합니다.",
		order: 72,
	},
	navItem: {
		id: "course-offerings-list",
		label: "CourseOffering",
		path: "/course-offerings",
		subject: "menu:course-offerings:list",
		order: 2,
		parent: {
			id: "courses",
			label: "수강 관리",
			subject: "menu:courses",
			icon: "Ticket",
			order: 13,
		},
	},
} satisfies AdminRouteMeta;
