import {
	BigIntIdFieldMetadata,
	ClassField,
	NumberFieldMetadata,
	StringFieldOptionalMetadata,
} from "@cocrepo/decorator/field";
import { ActivitySchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Routine } from "./routine.entity";
import { Task } from "./task.entity";

@AbstractEntityFields()
export class Activity extends ActivitySchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare id: ActivitySchema["id"];

	@BigIntIdFieldMetadata() declare routineSeq: ActivitySchema["routineSeq"];
	@BigIntIdFieldMetadata() declare taskSeq: ActivitySchema["taskSeq"];
	@NumberFieldMetadata() declare order: ActivitySchema["order"];
	@NumberFieldMetadata() declare repetitions: ActivitySchema["repetitions"];
	@NumberFieldMetadata() declare restTime: ActivitySchema["restTime"];
	@StringFieldOptionalMetadata({ nullable: true })
	declare notes: ActivitySchema["notes"];

	@ClassField(() => Routine) routine?: Routine;
	@ClassField(() => Task) task?: Task;
}
