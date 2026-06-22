export interface ContextCategorySnapshot {
	name?: string | null;
}

export interface ContextClassificationSnapshot {
	category?: ContextCategorySnapshot | null;
}

export interface ContextAssociationSnapshot {
	group?: {
		name?: string | null;
	} | null;
}

export interface ContextRoleSnapshot {
	id: string;
	name?: string | null;
	classification?: ContextClassificationSnapshot | null;
	associations?: ContextAssociationSnapshot[];
}

export interface ContextSpaceSnapshot {
	id: string;
	classification?: ContextClassificationSnapshot | null;
	spaceClassification?: ContextClassificationSnapshot | null;
	spaceClassifications?: ContextClassificationSnapshot[] | null;
	company?: unknown;
	ground?: unknown;
}

export interface ContextTenantSnapshot {
	id: string;
	roleId: string;
	userId?: string;
	spaceId: string;
	removedAt?: Date | null;
	role?: ContextRoleSnapshot | null;
	space?: ContextSpaceSnapshot | null;
}

export interface ContextUserSnapshot {
	id: string;
	spaceId?: string;
	email?: string;
	name?: string;
	phone?: string;
	removedAt?: Date | null;
	tenants?: ContextTenantSnapshot[];
	profiles?: unknown[];
	associations?: ContextAssociationSnapshot[];
	classification?: ContextClassificationSnapshot | null;
}
