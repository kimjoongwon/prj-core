import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "settings-auth",
		groupLabel: "인증 설정",
		pageId: "settings-auth:oidc-sessions",
		pageLabel: "OIDC 세션",
		pathPattern: "/settings/auth/oidc-sessions",
		description: "OIDC 세션 상태와 만료 정보를 확인합니다.",
		order: 84,
	},
	navItem: {
		id: "settings-auth-oidc-sessions",
		label: "OIDC 세션",
		path: "/settings/auth/oidc-sessions",
		subject: "menu:settings-auth:oidc-sessions",
		order: 4,
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
