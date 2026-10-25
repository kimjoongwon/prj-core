import { BigIntIdFieldMetadata, ClassField } from "@cocrepo/decorator/field";
import { RoleAssociationSchema } from "@cocrepo/schema";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Group } from "./group.entity";

@AbstractEntityFields()
export class RoleAssociation extends RoleAssociationSchema {
	/** 공개 식별자 ULID */
	declare id: RoleAssociationSchema["id"];

	@BigIntIdFieldMetadata()
	declare roleSeq: RoleAssociationSchema["roleSeq"];
	@BigIntIdFieldMetadata()
	declare groupSeq: RoleAssociationSchema["groupSeq"];

	@ClassField(() => Group, { required: false, swagger: false })
	group?: Group;
}
