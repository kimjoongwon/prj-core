import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "settings-auth",
		groupLabel: "인증 설정",
		pageId: "settings-auth:audit-logs",
		pageLabel: "인증 감사 로그",
		pathPattern: "/settings/auth/audit-logs",
		description: "인증 이벤트와 감사 로그를 조회합니다.",
		order: 85,
	},
	navItem: {
		id: "settings-auth-audit-logs",
		label: "인증 감사 로그",
		path: "/settings/auth/audit-logs",
		subject: "menu:settings-auth:audit-logs",
		order: 5,
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
