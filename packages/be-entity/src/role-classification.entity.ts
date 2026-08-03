import { AbstractEntity } from "./abstract.entity";
import type { Category } from "./category.entity";
import type { Role } from "./role.entity";

export class RoleClassification extends AbstractEntity {
	/** 공개 식별자 ULID */
	roleClassificationId!: string;

	categoryId!: bigint;
	roleId!: bigint;

	category?: Category;
	role?: Role;
}
