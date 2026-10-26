import { BigIntIdFieldMetadata, ClassField } from "@cocrepo/decorator/field";
import { RoleClassificationSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Category } from "./category.entity";
import { Role } from "./role.entity";

@AbstractEntityFields()
export class RoleClassification extends RoleClassificationSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare roleClassificationId: RoleClassificationSchema["roleClassificationId"];

	@BigIntIdFieldMetadata()
	declare categoryId: RoleClassificationSchema["categoryId"];
	@BigIntIdFieldMetadata()
	declare roleId: RoleClassificationSchema["roleId"];

	@ClassField(() => Category, { required: false })
	category?: Category;
	@ClassField(() => Role, { required: false })
	role?: Role;
}
