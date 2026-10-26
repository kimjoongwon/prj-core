import { BigIntIdFieldMetadata, ClassField } from "@cocrepo/decorator/field";
import { UserAssociationSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Group } from "./group.entity";
import { User } from "./user.entity";

@AbstractEntityFields()
export class UserAssociation extends UserAssociationSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare userAssociationId: UserAssociationSchema["userAssociationId"];

	@BigIntIdFieldMetadata()
	declare userId: UserAssociationSchema["userId"];
	@BigIntIdFieldMetadata()
	declare groupId: UserAssociationSchema["groupId"];

	@ClassField(() => Group, { required: false, swagger: false })
	group?: Group;
	@ClassField(() => User, { required: false, swagger: false })
	user?: User;
}
