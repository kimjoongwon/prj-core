import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "settings-auth",
		groupLabel: "인증 설정",
		pageId: "settings-auth:oidc-clients:edit",
		pageLabel: "OIDC 클라이언트 수정",
		pathPattern: "/settings/auth/oidc-clients/[oidcClientId]/edit",
		description: "OIDC 클라이언트 설정을 수정합니다.",
		order: 83,
		menuLeafId: "settings-auth-oidc-clients",
	},
} satisfies AdminRouteMeta;
