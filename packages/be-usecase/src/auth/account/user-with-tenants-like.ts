import type { SpaceTenantLike } from "./space-tenant-like";

export type UserWithTenantsLike = {
	id: bigint;
	userSeq?: string;
	currentTenantSeq?: bigint | null;
	tenants?: SpaceTenantLike[];
};
