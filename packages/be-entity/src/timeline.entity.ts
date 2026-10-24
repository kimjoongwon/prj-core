import {
	BigIntIdFieldMetadata,
	BigIntIdFieldOptionalMetadata,
	ClassField,
	StringFieldMetadata,
	StringFieldOptionalMetadata,
} from "@cocrepo/decorator/field";
import { TimelineSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Session } from "./session.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

@AbstractEntityFields()
export class Timeline extends TimelineSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare id: TimelineSchema["id"];

	@BigIntIdFieldMetadata() declare spaceSeq: TimelineSchema["spaceSeq"];
	@BigIntIdFieldOptionalMetadata({ nullable: true })
	declare createdBySeq: TimelineSchema["createdBySeq"];
	@StringFieldMetadata() declare name: TimelineSchema["name"];
	@StringFieldOptionalMetadata({ nullable: true })
	declare description: TimelineSchema["description"];

	space?: Space;
	createdBy?: User;
	@ClassField(() => Session, { isArray: true }) sessions?: Session[];
}
