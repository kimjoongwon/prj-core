import { SetMetadata } from "@nestjs/common";

export const ROLE_CATEGORIES_KEY = "roleCategories";

// RoleCategoryNames 타입은 사용처에서 정의
export const RoleCategories = <T extends string>(categories: T[]) =>
	SetMetadata(ROLE_CATEGORIES_KEY, categories);
