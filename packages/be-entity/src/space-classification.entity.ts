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
	declare id: SpaceClassificationSchema["id"];

	@BigIntIdFieldMetadata()
	declare categorySeq: SpaceClassificationSchema["categorySeq"];
	@BigIntIdFieldMetadata()
	declare spaceSeq: SpaceClassificationSchema["spaceSeq"];

	@ClassField(() => Category, { required: false })
	category?: Category;
	@ClassField(() => Space, { required: false })
	space?: Space;
}
