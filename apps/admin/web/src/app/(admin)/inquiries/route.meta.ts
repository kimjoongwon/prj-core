import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "inquiries",
		groupLabel: "문의 관리",
		pageId: "inquiries:list",
		pageLabel: "문의 목록",
		pathPattern: "/inquiries",
		description: "문의 목록을 조회합니다.",
		order: 34,
	},
	navItem: {
		id: "inquiries-list",
		label: "문의 목록",
		path: "/inquiries",
		subject: "menu:inquiries:list",
		order: 1,
		parent: {
			id: "inquiries",
			label: "문의 관리",
			subject: "menu:inquiries",
			icon: "MessageCircleQuestionMark",
			path: "/inquiries",
			order: 8,
		},
	},
} satisfies AdminRouteMeta;
