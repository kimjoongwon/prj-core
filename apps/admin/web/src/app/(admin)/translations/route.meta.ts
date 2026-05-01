import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "translations",
		groupLabel: "다국어",
		pageId: "translations:list",
		pageLabel: "정적 번역",
		pathPattern: "/translations",
		description: "admin과 idp에서 사용하는 정적 다국어 key-value를 관리합니다.",
		order: 69,
	},
	navItem: {
		id: "translations-list",
		label: "정적 번역",
		path: "/translations",
		subject: "menu:translations:list",
		order: 1,
		parent: {
			id: "translations",
			label: "다국어",
			subject: "menu:translations",
			icon: "Settings",
			order: 11,
		},
	},
} satisfies AdminRouteMeta;
