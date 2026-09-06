import {
	BigIntIdFieldMetadata,
	ClassField,
	NumberFieldMetadata,
	StringFieldMetadata,
	StringFieldOptionalMetadata,
	UUIDFieldOptionalMetadata,
} from "@cocrepo/decorator/field";
import { ProgramActivitySchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Program } from "./program.entity";

@AbstractEntityFields()
export class ProgramActivity extends ProgramActivitySchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare programActivityId: ProgramActivitySchema["programActivityId"];

	@BigIntIdFieldMetadata()
	declare programId: ProgramActivitySchema["programId"];
	@BigIntIdFieldMetadata() declare taskId: ProgramActivitySchema["taskId"];
	@NumberFieldMetadata() declare order: ProgramActivitySchema["order"];
	@NumberFieldMetadata()
	declare repetitions: ProgramActivitySchema["repetitions"];
	@NumberFieldMetadata() declare restTime: ProgramActivitySchema["restTime"];
	@StringFieldOptionalMetadata({ nullable: true })
	declare notes: ProgramActivitySchema["notes"];
	@StringFieldMetadata()
	declare exerciseName: ProgramActivitySchema["exerciseName"];
	@StringFieldOptionalMetadata({ nullable: true })
	declare exerciseDescription: ProgramActivitySchema["exerciseDescription"];
	@NumberFieldMetadata()
	declare exerciseDuration: ProgramActivitySchema["exerciseDuration"];
	@NumberFieldMetadata()
	declare exerciseCount: ProgramActivitySchema["exerciseCount"];
	@UUIDFieldOptionalMetadata({ nullable: true })
	declare imageFileId: ProgramActivitySchema["imageFileId"];
	@UUIDFieldOptionalMetadata({ nullable: true })
	declare videoFileId: ProgramActivitySchema["videoFileId"];

	@ClassField(() => Program, { required: false }) program?: Program;
}
