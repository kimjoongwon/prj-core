import { RoleClassification as RoleClassificationEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import { Category } from "./category.entity";
import { Role } from "./role.entity";

export class RoleClassification
	extends AbstractEntity
	implements RoleClassificationEntity
{
	categoryId!: string;
	roleId!: string;

	category?: Category;
	role?: Role;
}
