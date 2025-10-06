export { $Enums, Prisma, PrismaClient } from "@prisma/client";

export * from "./constant";
export { ApiResponseEntity } from "./decorator/api-response-entity.decorator";
// Decorator exports (avoiding conflicts)
export * from "./decorator/field";
export { IS_PUBLIC_KEY, Public } from "./decorator/public.decorator";
export {
	PUBLIC_ROUTE_KEY,
	PublicRoute,
} from "./decorator/public-route.decorator";
export {
	ROLE_CATEGORIES_KEY,
	RoleCategories,
} from "./decorator/role-categories.decorator";
export { ROLE_GROUPS_KEY, RoleGroups } from "./decorator/role-groups.decorator";
export { Roles } from "./decorator/roles.decorator";
export { ApiFile, type IApiFile } from "./decorator/swagger.schema";
export { type Constructor, UseDto } from "./decorator/use-dto.decorator";
export { UseEntity } from "./decorator/use-entity.decorator";

export * from "./dto";

export * from "./entity";

export * from "./enum";

export { PaginationUtil } from "./lib/PaginationUtil";

// Common database operations
export interface BaseEntity {
	id: string;
	seq: number;
	createdAt: Date;
	updatedAt?: Date | null;
	removedAt?: Date | null;
}

// Type utilities for Prisma models
export type WithoutId<T> = Omit<T, "id">;
export type WithoutTimestamps<T> = Omit<
	T,
	"createdAt" | "updatedAt" | "removedAt"
>;
export type CreateInput<T> = WithoutId<WithoutTimestamps<T>>;
export type UpdateInput<T> = Partial<WithoutTimestamps<T>>;
