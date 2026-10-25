import {
	BigIntIdFieldMetadata,
	BigIntIdFieldOptionalMetadata,
	ClassField,
	EnumFieldMetadata,
	StringFieldMetadata,
	StringFieldOptionalMetadata,
	ULIDFieldMetadata,
} from "@cocrepo/decorator/field";
import { GroupTypes } from "@cocrepo/enum";
import { GroupSchema } from "@cocrepo/schema";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Space } from "./space.entity";
import { User } from "./user.entity";

@AbstractEntityFields()
export class Group extends GroupSchema {
	/** 공개 식별자 ULID */
	@ULIDFieldMetadata()
	declare id: GroupSchema["id"];

	@StringFieldMetadata()
	declare name: GroupSchema["name"];
	@StringFieldOptionalMetadata({ nullable: true })
	declare label: GroupSchema["label"];
	@EnumFieldMetadata(() => GroupTypes, { required: true })
	declare type: GroupSchema["type"];
	@BigIntIdFieldMetadata()
	declare spaceSeq: GroupSchema["spaceSeq"];
	@BigIntIdFieldOptionalMetadata({ nullable: true })
	declare createdBySeq: GroupSchema["createdBySeq"];
	@ClassField(() => Space, { required: false })
	space?: Space;
	@ClassField(() => User, { required: false })
	createdBy?: User;
}
