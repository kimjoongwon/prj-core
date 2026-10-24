import { BigIntIdFieldMetadata, ClassField } from "@cocrepo/decorator/field";
import { SpaceAssociationSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Group } from "./group.entity";

@AbstractEntityFields()
export class SpaceAssociation extends SpaceAssociationSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare id: SpaceAssociationSchema["id"];

	@BigIntIdFieldMetadata()
	declare spaceSeq: SpaceAssociationSchema["spaceSeq"];
	@BigIntIdFieldMetadata()
	declare groupSeq: SpaceAssociationSchema["groupSeq"];

	@ClassField(() => Group, { required: false, swagger: false })
	group?: Group;
}
