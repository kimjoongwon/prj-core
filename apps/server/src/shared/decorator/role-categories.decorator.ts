import { SetMetadata } from "@nestjs/common";

export const ROLE_CATEGORIES_KEY = "roleCategories";

export const RoleCategories = (categories: string[]) =>
	SetMetadata(ROLE_CATEGORIES_KEY, categories);