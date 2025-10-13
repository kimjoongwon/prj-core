import { SetMetadata } from "@nestjs/common";
import { RoleCategoryNames } from "../enum/role-category-names.enum";

export const ROLE_CATEGORIES_KEY = "roleCategories";

export const RoleCategories = (categories: RoleCategoryNames[]) =>
	SetMetadata(ROLE_CATEGORIES_KEY, categories);
