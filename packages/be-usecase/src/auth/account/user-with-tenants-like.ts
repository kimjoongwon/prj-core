import type { SpaceTenantLike } from "./space-tenant-like";

export type UserWithTenantsLike = {
	/** 사용자 공개 ID (ULID) */
	id: string;
	currentTenantId?: string | null;
	tenants?: SpaceTenantLike[];
};
