import { BigIntIdFieldMetadata, ClassField } from "@cocrepo/decorator/field";
import { UserAssociationSchema } from "@cocrepo/schema";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Group } from "./group.entity";
import { User } from "./user.entity";

@AbstractEntityFields()
export class UserAssociation extends UserAssociationSchema {
	/** 공개 식별자 ULID */
	declare id: UserAssociationSchema["id"];

	@BigIntIdFieldMetadata()
	declare userSeq: UserAssociationSchema["userSeq"];
	@BigIntIdFieldMetadata()
	declare groupSeq: UserAssociationSchema["groupSeq"];

	@ClassField(() => Group, { required: false, swagger: false })
	group?: Group;
	@ClassField(() => User, { required: false, swagger: false })
	user?: User;
}
