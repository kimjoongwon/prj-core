import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "tenant-access-requests",
		groupLabel: "접근 승인",
		pageId: "tenant-access-requests:list",
		pageLabel: "접근 신청 목록",
		pathPattern: "/tenant-access-requests",
		description: "테넌트 접근 신청을 조회하고 검토합니다.",
		order: 62,
	},
	navItem: {
		id: "tenant-access-requests-list",
		label: "접근 승인",
		path: "/tenant-access-requests",
		subject: "menu:tenant-access-requests:list",
		order: 1,
		parent: {
			id: "tenant-access-requests",
			label: "접근 승인",
			subject: "menu:tenant-access-requests",
			icon: "ShieldCheck",
			path: "/tenant-access-requests",
			order: 10,
		},
	},
} satisfies AdminRouteMeta;
