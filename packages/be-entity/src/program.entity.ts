import {
	BigIntIdFieldMetadata,
	ClassField,
	NumberFieldMetadata,
	StringFieldMetadata,
	StringFieldOptionalMetadata,
} from "@cocrepo/decorator/field";
import { ProgramSchema } from "@cocrepo/schema";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { ProgramActivity } from "./program-activity.entity";
import { Routine } from "./routine.entity";
import { Session } from "./session.entity";

@AbstractEntityFields()
export class Program extends ProgramSchema {
	/** 공개 식별자 ULID */
	declare id: ProgramSchema["id"];

	@BigIntIdFieldMetadata() declare routineSeq: ProgramSchema["routineSeq"];
	@BigIntIdFieldMetadata() declare sessionSeq: ProgramSchema["sessionSeq"];
	@BigIntIdFieldMetadata()
	declare instructorSeq: ProgramSchema["instructorSeq"];
	@NumberFieldMetadata() declare capacity: ProgramSchema["capacity"];
	@StringFieldMetadata() declare name: ProgramSchema["name"];
	@StringFieldOptionalMetadata({ nullable: true })
	declare level: ProgramSchema["level"];
	@StringFieldOptionalMetadata({ nullable: true })
	declare routineNameSnapshot: ProgramSchema["routineNameSnapshot"];
	@StringFieldOptionalMetadata({ nullable: true })
	declare routineLabelSnapshot: ProgramSchema["routineLabelSnapshot"];

	@ClassField(() => Routine) routine?: Routine;
	@ClassField(() => Session) session?: Session;
	@ClassField(() => ProgramActivity, {
		required: false,
		each: true,
		isArray: true,
	})
	programActivities?: ProgramActivity[];
}
