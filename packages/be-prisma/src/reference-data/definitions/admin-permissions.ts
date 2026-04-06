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
	roleName: "FULL_ACCESS" | "MANAGE";
	subject: string;
	actionName: "manage" | "access";
	inverted: false;
	description: string;
}

const PREVIOUS_ADMIN_MENU_SUBJECT_NAMES = [
	"menu:dashboard",
	"menu:users",
	"menu:reservations",
	"menu:notifications",
	"menu:inquiries",
	"menu:contents",
	"menu:templates",
	"menu:sessions",
	"menu:spaces",
	"menu:admins",
	"menu:roles",
	"menu:spaces:list",
	"menu:timelines",
	"menu:timelines:list",
	"menu:tasks",
	"menu:tasks:list",
	"menu:routines",
	"menu:routines:list",
	"menu:templates:list",
	"menu:role-groups",
	"menu:role-groups:list",
	"menu:role-categories",
	"menu:role-categories:list",
	"menu:abilities",
	"menu:abilities:list",
	"menu:actions",
	"menu:actions:list",
	"menu:subjects",
	"menu:subjects:list",
	"menu:users:list",
	"menu:users:grades",
	"menu:users:withdrawn",
	"menu:reservations:today",
	"menu:reservations:list",
	"menu:reservations:calendar",
	"menu:reservations:stats",
	"menu:notifications:send",
	"menu:notifications:history",
	"menu:notifications:templates",
	"menu:notifications:settings",
	"menu:inquiries:list",
	"menu:inquiries:direct",
	"menu:inquiries:answered",
	"menu:inquiries:faq",
	"menu:contents:notices",
	"menu:contents:banners",
	"menu:contents:events",
	"menu:contents:terms",
	"menu:templates:sms",
	"menu:templates:email",
	"menu:templates:push",
	"menu:templates:html",
	"menu:sessions:timelines",
	"menu:sessions:list",
	"menu:sessions:programs",
	"menu:sessions:routines",
	"menu:spaces:info",
	"menu:spaces:programs",
	"menu:spaces:equipment",
	"menu:admins:list",
	"menu:admins:invitations",
	"menu:roles:list",
	"menu:roles:abilities",
	"menu:schedules",
	"menu:files",
	"menu:wallets",
	"menu:settings",
	"menu:users:profiles",
	"menu:users:categories",
	"menu:users:groups",
	"menu:schedules:timelines",
	"menu:schedules:sessions",
	"menu:schedules:programs",
	"menu:schedules:routines",
	"menu:files:list",
	"menu:files:categories",
	"menu:contents:posts",
	"menu:contents:list",
	"menu:wallets:list",
	"menu:wallets:transactions",
	"menu:settings:spaces",
	"menu:settings:admins",
	"menu:settings:abilities",
	"menu:settings:system",
	"menu:settings:ui-configs",
] as const;

const MANAGE_EXCLUDED_ADMIN_MENU_SUBJECTS = new Set<string>([
	"menu:templates",
	"menu:templates:list",
	"menu:abilities:list",
	"menu:actions:list",
	"menu:subjects:list",
]);

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

const currentAdminMenuSubjectNameSet = new Set(
	adminMenuSubjectSeedData.map((subject) => subject.name),
);

export const legacyAdminMenuSubjectNames = PREVIOUS_ADMIN_MENU_SUBJECT_NAMES.filter(
	(subjectName) => !currentAdminMenuSubjectNameSet.has(subjectName),
);

export const legacyAdminPageSubjectNames: string[] = [];

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

export const adminManageMenuAccessAbilitySeedData: AdminDerivedAbilitySeedData[] =
	adminMenuSubjectSeedData
		.filter(
			(subject) => !MANAGE_EXCLUDED_ADMIN_MENU_SUBJECTS.has(subject.name),
		)
		.map((subject) => ({
			roleName: "MANAGE" as const,
			subject: subject.name,
			actionName: "access" as const,
			inverted: false as const,
			description: `${subject.displayName} 접근 권한`,
		}));
