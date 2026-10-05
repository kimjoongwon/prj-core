import type { AppIconName, NavItemConfig } from "@cocrepo/type";

export interface AdminRoutePageMeta {
	groupId: string;
	groupLabel: string;
	pageId: string;
	pageLabel: string;
	pathPattern: string;
	order: number;
	description?: string;
	subject?: string;
	menuLeafId?: string;
}

export interface AdminRouteNavParentMeta {
	id: string;
	label: string;
	subject: string;
	order: number;
	icon?: AppIconName;
	path?: string;
}

export interface AdminRouteNavItemMeta {
	id: string;
	label: string;
	path: string;
	subject: string;
	order: number;
	icon?: AppIconName;
	parent?: AdminRouteNavParentMeta;
}

export interface AdminRouteMeta {
	page: AdminRoutePageMeta;
	navItem?: AdminRouteNavItemMeta;
}

export interface GeneratedAdminPageAccessItem {
	groupId: string;
	groupLabel: string;
	pageId: string;
	pageLabel: string;
	pathPattern: string;
	subject: string;
	description?: string;
	menuLeafId?: string;
}

export interface GeneratedAdminRouteCatalog {
	navItems: NavItemConfig[];
	pageAccessItems: GeneratedAdminPageAccessItem[];
	sources: string[];
}
