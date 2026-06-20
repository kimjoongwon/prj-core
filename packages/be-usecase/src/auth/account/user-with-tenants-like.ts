import type { SpaceTenantLike } from "./space-tenant-like";

export type UserWithTenantsLike = {
	tenants?: SpaceTenantLike[];
};
