import type { AdminRouteMeta } from "@cocrepo/constant";

export const routeMeta = {
	page: {
		groupId: "users",
		groupLabel: "회원",
		pageId: "email-verifications:list",
		pageLabel: "이메일 인증 목록",
		pathPattern: "/email-verifications",
		description: "회원가입 전 이메일 인증 요청과 발송 상태를 확인합니다.",
		order: 68,
	},
	navItem: {
		id: "email-verifications-list",
		label: "이메일 인증",
		path: "/email-verifications",
		subject: "menu:users:email-verifications",
		order: 2,
		parent: {
			id: "users",
			label: "회원",
			subject: "menu:users",
			icon: "Users",
			path: "/users",
			order: 2,
		},
	},
} satisfies AdminRouteMeta;
