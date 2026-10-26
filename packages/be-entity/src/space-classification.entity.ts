import { BigIntIdFieldMetadata, ClassField } from "@cocrepo/decorator/field";
import { SpaceClassificationSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Category } from "./category.entity";
import { Space } from "./space.entity";

@AbstractEntityFields()
export class SpaceClassification extends SpaceClassificationSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare spaceClassificationId: SpaceClassificationSchema["spaceClassificationId"];

	@BigIntIdFieldMetadata()
	declare categoryId: SpaceClassificationSchema["categoryId"];
	@BigIntIdFieldMetadata()
	declare spaceId: SpaceClassificationSchema["spaceId"];

	@ClassField(() => Category, { required: false })
	category?: Category;
	@ClassField(() => Space, { required: false })
	space?: Space;
}
