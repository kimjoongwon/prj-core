import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "courses",
		groupLabel: "수강 관리",
		pageId: "enrollments:list",
		pageLabel: "Enrollment",
		pathPattern: "/enrollments",
		description: "결제 후 활성화되는 수강 신청 상태를 관리합니다.",
		order: 73,
	},
	navItem: {
		id: "enrollments-list",
		label: "Enrollment",
		path: "/enrollments",
		subject: "menu:enrollments:list",
		order: 3,
		parent: {
			id: "courses",
			label: "수강 관리",
			subject: "menu:courses",
			icon: "Ticket",
			order: 13,
		},
	},
} satisfies AdminRouteMeta;
