import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "settings-auth",
		groupLabel: "인증 설정",
		pageId: "settings-auth:accounts",
		pageLabel: "계정",
		pathPattern: "/settings/auth/accounts",
		description: "인증 계정 상태와 잠금 정보를 관리합니다.",
		order: 78,
	},
	navItem: {
		id: "settings-auth-accounts",
		label: "계정",
		path: "/settings/auth/accounts",
		subject: "menu:settings-auth:accounts",
		order: 2,
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
