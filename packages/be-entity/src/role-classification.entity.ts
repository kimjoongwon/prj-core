import type { RoleClassification as RoleClassificationEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Category } from "./category.entity";
import type { Role } from "./role.entity";

export class RoleClassification
	extends AbstractEntity
	implements RoleClassificationEntity
{
	categoryId!: string;
	roleId!: string;

	category?: Category;
	role?: Role;
}
