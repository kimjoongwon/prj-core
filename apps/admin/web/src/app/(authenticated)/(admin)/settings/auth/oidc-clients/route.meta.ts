import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "settings-auth",
		groupLabel: "인증 설정",
		pageId: "settings-auth:oidc-clients",
		pageLabel: "OIDC 클라이언트",
		pathPattern: "/settings/auth/oidc-clients",
		description: "OIDC 클라이언트 등록과 redirect 설정을 관리합니다.",
		order: 80,
	},
	navItem: {
		id: "settings-auth-oidc-clients",
		label: "OIDC 클라이언트",
		path: "/settings/auth/oidc-clients",
		subject: "menu:settings-auth:oidc-clients",
		order: 3,
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
