import { RoleCategoryNames } from "@cocrepo/enum";
import { SetMetadata } from "@nestjs/common";

export const ROLE_CATEGORIES_KEY = "roleCategories";

// RoleCategoryNames 타입을 직접 사용
export const RoleCategories = (categories: RoleCategoryNames[]) =>
	SetMetadata(ROLE_CATEGORIES_KEY, categories);
