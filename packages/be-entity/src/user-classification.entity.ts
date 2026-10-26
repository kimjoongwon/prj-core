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
	declare userClassificationId: UserClassificationSchema["userClassificationId"];

	@BigIntIdFieldMetadata()
	declare categoryId: UserClassificationSchema["categoryId"];
	@BigIntIdFieldMetadata()
	declare userId: UserClassificationSchema["userId"];
	@ClassField(() => User, { required: false })
	user?: User;
	@ClassField(() => Category, { required: false })
	category?: Category;
}
