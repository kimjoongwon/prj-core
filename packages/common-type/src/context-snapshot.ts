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
	roleSeq: DatabaseId;
	userSeq?: DatabaseId;
	spaceSeq: DatabaseId;
	removedAt?: Date | null;
	role?: ContextRoleSnapshot | null;
	space?: ContextSpaceSnapshot | null;
}

export interface ContextUserSnapshot {
	id: DatabaseId;
	currentTenantSeq?: DatabaseId | null;
	spaceSeq?: DatabaseId;
	email?: string;
	name?: string;
	phone?: string;
	removedAt?: Date | null;
	tenants?: ContextTenantSnapshot[];
	profiles?: unknown[];
	associations?: ContextAssociationSnapshot[];
	classification?: ContextClassificationSnapshot | null;
}
