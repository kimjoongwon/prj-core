import type { GeneratedAdminPageAccessItem } from "./admin-route-meta";
import { GENERATED_ADMIN_PAGE_ACCESS_ITEMS } from "./generated/admin-route-catalog.generated";
import { ADMIN_MENU_PERMISSION_LEAFS } from "./admin-menu";

export interface AdminPageAccessItem extends GeneratedAdminPageAccessItem {}

export interface AdminCrudBundle {
	bundleId: string;
	groupLabel: string;
	bundleLabel: string;
	subject: string;
	description?: string;
	actions: readonly ["create", "read", "update", "delete", "manage"];
}

const CRUD_ACTIONS = ["create", "read", "update", "delete", "manage"] as const;

export const ADMIN_PAGE_ACCESS_ITEMS: AdminPageAccessItem[] =
	GENERATED_ADMIN_PAGE_ACCESS_ITEMS;

export const ADMIN_PAGE_ACCESS_SUBJECTS = ADMIN_PAGE_ACCESS_ITEMS.map(
	(item) => item.subject,
);

export const ADMIN_CRUD_BUNDLES: AdminCrudBundle[] = [
	{
		bundleId: "user",
		groupLabel: "회원",
		bundleLabel: "회원 데이터",
		subject: "entity:User",
		description: "회원 생성, 조회, 수정, 삭제, 전체 관리 권한을 묶어 편집합니다.",
		actions: CRUD_ACTIONS,
	},
	{
		bundleId: "space",
		groupLabel: "공간 관리",
		bundleLabel: "공간 데이터",
		subject: "entity:Space",
		description: "공간 엔티티에 대한 기본 CRUD 권한을 관리합니다.",
		actions: CRUD_ACTIONS,
	},
	{
		bundleId: "ground",
		groupLabel: "공간 관리",
		bundleLabel: "Ground 데이터",
		subject: "entity:Ground",
		description: "공간 상세(Ground) 데이터를 관리합니다.",
		actions: CRUD_ACTIONS,
	},
	{
		bundleId: "reservation",
		groupLabel: "일정 관리",
		bundleLabel: "예약 데이터",
		subject: "entity:Reservation",
		description: "예약 엔티티에 대한 기본 CRUD 권한을 묶어 편집합니다.",
		actions: CRUD_ACTIONS,
	},
	{
		bundleId: "content",
		groupLabel: "콘텐츠",
		bundleLabel: "콘텐츠 데이터",
		subject: "entity:Content",
		description: "콘텐츠 엔티티에 대한 기본 CRUD 권한을 묶어 편집합니다.",
		actions: CRUD_ACTIONS,
	},
	{
		bundleId: "role",
		groupLabel: "권한 관리",
		bundleLabel: "역할 데이터",
		subject: "entity:Role",
		description: "역할 엔티티에 대한 기본 CRUD 권한을 묶어 편집합니다.",
		actions: CRUD_ACTIONS,
	},
	{
		bundleId: "ability",
		groupLabel: "권한 관리",
		bundleLabel: "권한 데이터",
		subject: "entity:Ability",
		description: "권한 엔티티에 대한 기본 CRUD 권한을 묶어 편집합니다.",
		actions: CRUD_ACTIONS,
	},
];

function pathPatternToRegExp(pathPattern: string): RegExp {
	const escaped = pathPattern
		.split("/")
		.map((segment) => {
			if (segment.startsWith("[") && segment.endsWith("]")) {
				return "[^/]+";
			}
			return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		})
		.join("/");

	return new RegExp(`^${escaped}$`);
}

const PAGE_ACCESS_MATCHERS = [...ADMIN_PAGE_ACCESS_ITEMS]
	.sort((left, right) => {
		const leftDynamicCount = (left.pathPattern.match(/\[[^/]+\]/g) ?? []).length;
		const rightDynamicCount =
			(right.pathPattern.match(/\[[^/]+\]/g) ?? []).length;

		if (leftDynamicCount !== rightDynamicCount) {
			return leftDynamicCount - rightDynamicCount;
		}

		return right.pathPattern.length - left.pathPattern.length;
	})
	.map((item) => ({
		item,
		regExp: pathPatternToRegExp(item.pathPattern),
	}));

export function matchAdminPageAccessItem(pathname: string) {
	return PAGE_ACCESS_MATCHERS.find((entry) => entry.regExp.test(pathname))?.item;
}

export const ADMIN_MENU_PERMISSION_GROUPS = Array.from(
	new Map(
		ADMIN_MENU_PERMISSION_LEAFS.map((leaf) => [
			leaf.groupId,
			{
				groupId: leaf.groupId,
				groupLabel: leaf.groupLabel,
				groupSubject: leaf.groupSubject,
			},
		]),
	).values(),
);
