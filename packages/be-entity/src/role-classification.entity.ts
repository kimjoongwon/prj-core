import type { RoleClassification as RoleClassificationEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Category } from "./category.entity";
import type { DomainEntityModel } from "./domain-entity-model.type";
import type { Role } from "./role.entity";

export class RoleClassification
	extends AbstractEntity
	implements DomainEntityModel<RoleClassificationEntity>
{
	categoryId!: string;
	roleId!: string;

	category?: Category;
	role?: Role;
}
