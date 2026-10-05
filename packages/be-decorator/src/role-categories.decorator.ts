import type { RoleCategoryName } from "@cocrepo/enum";
import { SetMetadata } from "@nestjs/common";

export const ROLE_CATEGORIES_KEY = "roleCategories";

// RoleCategoryName 타입을 직접 사용
export const RoleCategories = (categories: RoleCategoryName[]) =>
	SetMetadata(ROLE_CATEGORIES_KEY, categories);
