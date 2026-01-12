import type { AdminMenuGroup } from "@cocrepo/ui";

/**
 * Admin 메뉴 구성
 * permission 필드는 CASL Subject 패턴을 따릅니다 (menu:xxx)
 */
export const menuGroups: AdminMenuGroup[] = [
	{
		id: "main",
		label: "메인",
		items: [
			{
				id: "dashboard",
				label: "대시보드",
				icon: "LayoutDashboard",
				path: "/",
				permission: "menu:dashboard",
			},
		],
	},
	{
		id: "management",
		label: "관리",
		items: [
			{
				id: "users",
				label: "사용자 관리",
				icon: "Users",
				path: "/users",
				permission: "menu:users",
				children: [
					{
						id: "users-list",
						label: "사용자 목록",
						path: "/users",
						permission: "menu:users/list",
					},
					{
						id: "users-roles",
						label: "역할 관리",
						path: "/users/roles",
						permission: "menu:users/roles",
					},
				],
			},
			{
				id: "permissions",
				label: "권한 관리",
				icon: "Shield",
				path: "/permissions",
				permission: "menu:permissions",
				children: [
					{
						id: "permissions-actions",
						label: "Action 관리",
						path: "/permissions/actions",
						permission: "menu:permissions/actions",
					},
					{
						id: "permissions-subjects",
						label: "Subject 관리",
						path: "/permissions/subjects",
						permission: "menu:permissions/subjects",
					},
					{
						id: "permissions-abilities",
						label: "Ability 관리",
						path: "/permissions/abilities",
						permission: "menu:permissions/abilities",
					},
				],
			},
		],
	},
	{
		id: "settings",
		label: "설정",
		items: [
			{
				id: "settings-general",
				label: "일반 설정",
				icon: "Settings",
				path: "/settings",
				permission: "menu:settings",
			},
			{
				id: "settings-system",
				label: "시스템 설정",
				icon: "Cog",
				path: "/settings/system",
				permission: "menu:settings/system",
			},
		],
	},
];
