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
	/** 역할 공개 ID (ULID) */
	id: string;
	name?: string | null;
	classification?: ContextClassificationSnapshot | null;
	associations?: ContextAssociationSnapshot[];
}

export interface ContextFitnessCenterSnapshot {
	company?: unknown;
}

export interface ContextSpaceSnapshot {
	/** 공간 공개 ID (ULID) */
	id: string;
	classification?: ContextClassificationSnapshot | null;
	spaceClassification?: ContextClassificationSnapshot | null;
	spaceClassifications?: ContextClassificationSnapshot[] | null;
	fitnessCenter?: ContextFitnessCenterSnapshot | null;
}

export interface ContextTenantSnapshot {
	/** 테넌트 공개 ID (ULID) */
	id: string;
	roleSeq?: DatabaseId;
	userSeq?: DatabaseId;
	spaceSeq?: DatabaseId;
	removedAt?: Date | null;
	role?: ContextRoleSnapshot | null;
	space?: ContextSpaceSnapshot | null;
}

export interface ContextUserSnapshot {
	/** 사용자 공개 ID (ULID) */
	id: string;
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
