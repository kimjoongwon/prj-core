import {
	BigIntIdValidation,
	NumberValidation,
	StringValidation,
	StringValidationOptional,
	UUIDValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** ProgramActivity의 DB 필드 타입과 공통 검증입니다. */
export class ProgramActivitySchema
	extends AbstractSchema
{
	programActivityId!: string;

	@BigIntIdValidation()
	programId!: bigint;

	@BigIntIdValidation()
	taskId!: bigint;

	@NumberValidation()
	order!: number;

	@NumberValidation()
	repetitions!: number;

	@NumberValidation()
	restTime!: number;

	@StringValidationOptional({ nullable: true })
	notes!: string | null;

	@StringValidation()
	exerciseName!: string;

	@StringValidationOptional({ nullable: true })
	exerciseDescription!: string | null;

	@NumberValidation()
	exerciseDuration!: number;

	@NumberValidation()
	exerciseCount!: number;

	@UUIDValidationOptional({ nullable: true })
	imageFileId!: string | null;

	@UUIDValidationOptional({ nullable: true })
	videoFileId!: string | null;
}
