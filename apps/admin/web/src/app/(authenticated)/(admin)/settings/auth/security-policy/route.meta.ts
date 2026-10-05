import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "settings-auth",
		groupLabel: "인증 설정",
		pageId: "settings-auth:security-policy",
		pageLabel: "보안 정책",
		pathPattern: "/settings/auth/security-policy",
		description: "로그인 잠금과 비밀번호 정책을 관리합니다.",
		order: 86,
	},
	navItem: {
		id: "settings-auth-security-policy",
		label: "보안 정책",
		path: "/settings/auth/security-policy",
		subject: "menu:settings-auth:security-policy",
		order: 6,
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
