import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "settings-auth",
		groupLabel: "인증 설정",
		pageId: "settings-auth:dashboard",
		pageLabel: "인증 대시보드",
		pathPattern: "/settings/auth",
		description: "인증 운영 현황과 OIDC 관리 지표를 확인합니다.",
		order: 77,
	},
	navItem: {
		id: "settings-auth-dashboard",
		label: "인증 대시보드",
		path: "/settings/auth",
		subject: "menu:settings-auth:dashboard",
		order: 1,
		parent: {
			id: "settings-auth",
			label: "인증 설정",
			subject: "menu:settings-auth",
			icon: "KeyRound",
			path: "/settings/auth",
			order: 15,
		},
	},
} satisfies AdminRouteMeta;
