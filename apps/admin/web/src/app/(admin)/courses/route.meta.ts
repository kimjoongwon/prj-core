import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "courses",
		groupLabel: "수강 관리",
		pageId: "courses:list",
		pageLabel: "Course",
		pathPattern: "/courses",
		description: "무엇을 배우는지와 기본 수강 상품 정책을 관리합니다.",
		order: 71,
	},
	navItem: {
		id: "courses-list",
		label: "Course",
		path: "/courses",
		subject: "menu:courses:list",
		order: 1,
		parent: {
			id: "courses",
			label: "수강 관리",
			subject: "menu:courses",
			icon: "Ticket",
			order: 13,
		},
	},
} satisfies AdminRouteMeta;
