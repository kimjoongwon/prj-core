import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "terms",
		groupLabel: "약관 관리",
		pageId: "terms:list",
		pageLabel: "약관 관리",
		pathPattern: "/terms",
		description: "모바일과 web 서비스에 노출할 약관/동의 문서를 관리합니다.",
		order: 70,
	},
	navItem: {
		id: "terms-list",
		label: "약관 관리",
		path: "/terms",
		subject: "menu:terms:list",
		order: 1,
		parent: {
			id: "terms",
			label: "약관 관리",
			subject: "menu:terms",
			icon: "FileSearch",
			order: 12,
		},
	},
} satisfies AdminRouteMeta;
