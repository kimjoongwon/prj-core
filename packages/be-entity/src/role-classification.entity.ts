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
	declare id: RoleClassificationSchema["id"];

	@BigIntIdFieldMetadata()
	declare categorySeq: RoleClassificationSchema["categorySeq"];
	@BigIntIdFieldMetadata()
	declare roleSeq: RoleClassificationSchema["roleSeq"];

	@ClassField(() => Category, { required: false })
	category?: Category;
	@ClassField(() => Role, { required: false })
	role?: Role;
}
