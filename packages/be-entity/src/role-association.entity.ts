import { BigIntIdFieldMetadata, ClassField } from "@cocrepo/decorator/field";
import { RoleAssociationSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Group } from "./group.entity";

@AbstractEntityFields()
export class RoleAssociation extends RoleAssociationSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare roleAssociationId: RoleAssociationSchema["roleAssociationId"];

	@BigIntIdFieldMetadata()
	declare roleId: RoleAssociationSchema["roleId"];
	@BigIntIdFieldMetadata()
	declare groupId: RoleAssociationSchema["groupId"];

	@ClassField(() => Group, { required: false, swagger: false })
	group?: Group;
}
