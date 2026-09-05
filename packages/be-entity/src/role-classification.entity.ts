import { BigIntIdField, ClassField } from "@cocrepo/decorator/field";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { Category } from "./category.entity";
import { Role } from "./role.entity";

export class RoleClassification extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	roleClassificationId!: string;

	@BigIntIdField()
	categoryId!: bigint;
	@BigIntIdField()
	roleId!: bigint;

	@ClassField(() => Category, { required: false })
	category?: Category;
	@ClassField(() => Role, { required: false })
	role?: Role;
}
