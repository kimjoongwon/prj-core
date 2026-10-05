import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "settings-auth",
		groupLabel: "인증 설정",
		pageId: "settings-auth:accounts:detail",
		pageLabel: "계정 상세",
		pathPattern: "/settings/auth/accounts/[userId]",
		description: "인증 계정 상세와 접근 권한을 확인합니다.",
		order: 79,
		menuLeafId: "settings-auth-accounts",
	},
} satisfies AdminRouteMeta;
