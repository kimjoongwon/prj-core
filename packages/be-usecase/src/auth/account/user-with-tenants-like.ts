import type { SpaceTenantLike } from "./space-tenant-like";

export type UserWithTenantsLike = {
	id: string;
	currentTenantId?: string | null;
	tenants?: SpaceTenantLike[];
};
