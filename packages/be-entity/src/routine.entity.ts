import {
	BigIntIdFieldMetadata,
	BigIntIdFieldOptionalMetadata,
	ClassField,
	StringFieldMetadata,
} from "@cocrepo/decorator/field";
import { RoutineSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Activity } from "./activity.entity";
import { Program } from "./program.entity";
import type { Space } from "./space.entity";
import { User } from "./user.entity";

@AbstractEntityFields()
export class Routine extends RoutineSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true }) declare routineId: RoutineSchema["routineId"];

	@StringFieldMetadata() declare name: RoutineSchema["name"];
	@StringFieldMetadata() declare label: RoutineSchema["label"];
	@BigIntIdFieldMetadata() declare spaceId: RoutineSchema["spaceId"];
	@BigIntIdFieldOptionalMetadata({ nullable: true })
	declare createdById: RoutineSchema["createdById"];

	space?: Space;
	@ClassField(() => User, { required: false, nullable: true })
	createdBy?: User | null;
	@ClassField(() => Program, { isArray: true })
	programs?: Program[];
	@ClassField(() => Activity, { isArray: true })
	activities?: Activity[];
}
