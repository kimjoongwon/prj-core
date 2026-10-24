import { BigIntIdFieldMetadata, ClassField } from "@cocrepo/decorator/field";
import { UserClassificationSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Category } from "./category.entity";
import { User } from "./user.entity";

@AbstractEntityFields()
export class UserClassification extends UserClassificationSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare id: UserClassificationSchema["id"];

	@BigIntIdFieldMetadata()
	declare categorySeq: UserClassificationSchema["categorySeq"];
	@BigIntIdFieldMetadata()
	declare userSeq: UserClassificationSchema["userSeq"];
	@ClassField(() => User, { required: false })
	user?: User;
	@ClassField(() => Category, { required: false })
	category?: Category;
}
