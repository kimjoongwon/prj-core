import { BigIntIdField, ClassField } from "@cocrepo/decorator/field";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { Category } from "./category.entity";
import { Space } from "./space.entity";

export class SpaceClassification extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	spaceClassificationId!: string;

	@BigIntIdField()
	categoryId!: bigint;
	@BigIntIdField()
	spaceId!: bigint;

	@ClassField(() => Category, { required: false })
	category?: Category;
	@ClassField(() => Space, { required: false })
	space?: Space;
}
