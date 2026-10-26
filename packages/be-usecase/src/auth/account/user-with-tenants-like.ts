import type { SpaceTenantLike } from "./space-tenant-like";

export type UserWithTenantsLike = {
	id: bigint;
	userId?: string;
	currentTenantId?: bigint | null;
	tenants?: SpaceTenantLike[];
};
