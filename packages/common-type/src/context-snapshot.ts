import type { DatabaseId } from "./database-id";

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
	id: DatabaseId;
	name?: string | null;
	classification?: ContextClassificationSnapshot | null;
	associations?: ContextAssociationSnapshot[];
}

export interface ContextFitnessCenterSnapshot {
	company?: unknown;
}

export interface ContextSpaceSnapshot {
	id: DatabaseId;
	classification?: ContextClassificationSnapshot | null;
	spaceClassification?: ContextClassificationSnapshot | null;
	spaceClassifications?: ContextClassificationSnapshot[] | null;
	fitnessCenter?: ContextFitnessCenterSnapshot | null;
}

export interface ContextTenantSnapshot {
	id: DatabaseId;
	roleId: DatabaseId;
	userId?: DatabaseId;
	spaceId: DatabaseId;
	removedAt?: Date | null;
	role?: ContextRoleSnapshot | null;
	space?: ContextSpaceSnapshot | null;
}

export interface ContextUserSnapshot {
	id: DatabaseId;
	currentTenantId?: DatabaseId | null;
	spaceId?: DatabaseId;
	email?: string;
	name?: string;
	phone?: string;
	removedAt?: Date | null;
	tenants?: ContextTenantSnapshot[];
	profiles?: unknown[];
	associations?: ContextAssociationSnapshot[];
	classification?: ContextClassificationSnapshot | null;
}
