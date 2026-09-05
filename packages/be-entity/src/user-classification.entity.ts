import { BigIntIdField, ClassField } from "@cocrepo/decorator/field";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { Category } from "./category.entity";
import { User } from "./user.entity";

export class UserClassification extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	userClassificationId!: string;

	@BigIntIdField()
	categoryId!: bigint;
	@BigIntIdField()
	userId!: bigint;
	@ClassField(() => User, { required: false })
	user?: User;
	@ClassField(() => Category, { required: false })
	category?: Category;
}
