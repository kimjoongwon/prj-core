import { AbstractEntity } from "./abstract.entity";
import { BigIntIdField, ClassField, NumberField, StringField, StringFieldOptional, UUIDFieldOptional } from "@cocrepo/decorator/field";
import { Exclude } from "class-transformer";
import { Program } from "./program.entity";

export class ProgramActivity extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true }) programActivityId!: string;

	@BigIntIdField() programId!: bigint;
	@BigIntIdField() taskId!: bigint;
	@NumberField() order!: number;
	@NumberField() repetitions!: number;
	@NumberField() restTime!: number;
	@StringFieldOptional({ nullable: true }) notes!: string | null;
	@StringField() exerciseName!: string;
	@StringFieldOptional({ nullable: true }) exerciseDescription!: string | null;
	@NumberField() exerciseDuration!: number;
	@NumberField() exerciseCount!: number;
	@UUIDFieldOptional({ nullable: true }) imageFileId!: string | null;
	@UUIDFieldOptional({ nullable: true }) videoFileId!: string | null;

	@ClassField(() => Program, { required: false }) program?: Program;
}
