import {
	ADMIN_MENU_PERMISSION_GROUPS,
	ADMIN_MENU_PERMISSION_LEAFS,
	ADMIN_PAGE_ACCESS_ITEMS,
} from "@cocrepo/constant";

interface AdminDerivedSubjectSeedData {
	name: string;
	displayName: string;
	group: "menu" | "page";
	order: number;
	isSystem: boolean;
}

interface AdminDerivedAbilitySeedData {
	roleName: "FULL_ACCESS";
	subject: string;
	actionName: "manage" | "access";
	inverted: false;
	description: string;
}

function buildAdminMenuSubjectDisplayMap() {
	const displayMap = new Map<string, string>();

	for (const group of ADMIN_MENU_PERMISSION_GROUPS) {
		displayMap.set(group.groupSubject, group.groupLabel);
	}

	for (const leaf of ADMIN_MENU_PERMISSION_LEAFS) {
		displayMap.set(leaf.leafSubject, leaf.leafLabel);
	}

	return displayMap;
}

const adminMenuSubjectDisplayMap = buildAdminMenuSubjectDisplayMap();

export const adminMenuSubjectSeedData: AdminDerivedSubjectSeedData[] = Array.from(
	adminMenuSubjectDisplayMap.entries(),
).map(([name, displayName], index) => ({
	name,
	displayName,
	group: "menu",
	order: 100 + index,
	isSystem: true,
}));

export const adminPageSubjectSeedData: AdminDerivedSubjectSeedData[] =
	ADMIN_PAGE_ACCESS_ITEMS.map((item, index) => ({
		name: item.subject,
		displayName: item.pageLabel,
		group: "page",
		order: 1000 + index,
		isSystem: true,
	}));

export const adminFullAccessAbilitySeedData: AdminDerivedAbilitySeedData[] = [
	...adminMenuSubjectSeedData.map((subject) => ({
		roleName: "FULL_ACCESS" as const,
		subject: subject.name,
		actionName: "manage" as const,
		inverted: false as const,
		description: `${subject.displayName} 메뉴 전체 권한`,
	})),
	...adminPageSubjectSeedData.map((subject) => ({
		roleName: "FULL_ACCESS" as const,
		subject: subject.name,
		actionName: "access" as const,
		inverted: false as const,
		description: `${subject.displayName} 화면 접근 권한`,
	})),
];
