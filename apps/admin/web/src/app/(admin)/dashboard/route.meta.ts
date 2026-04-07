import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "dashboard",
		groupLabel: "대시보드",
		pageId: "dashboard",
		pageLabel: "대시보드",
		pathPattern: "/dashboard",
		description: "운영 지표와 최근 상태를 확인하는 첫 화면입니다.",
		order: 1,
	},
	navItem: {
		id: "dashboard",
		label: "대시보드",
		path: "/dashboard",
		subject: "menu:dashboard",
		icon: "LayoutDashboard",
		order: 1,
	},
} satisfies AdminRouteMeta;
