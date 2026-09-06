import type { ProgramActivity as PrismaProgramActivity } from "@cocrepo/prisma";
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
	implements PrismaProgramActivity
{
	programActivityId!: PrismaProgramActivity["programActivityId"];

	@BigIntIdValidation()
	programId!: PrismaProgramActivity["programId"];

	@BigIntIdValidation()
	taskId!: PrismaProgramActivity["taskId"];

	@NumberValidation()
	order!: PrismaProgramActivity["order"];

	@NumberValidation()
	repetitions!: PrismaProgramActivity["repetitions"];

	@NumberValidation()
	restTime!: PrismaProgramActivity["restTime"];

	@StringValidationOptional({ nullable: true })
	notes!: PrismaProgramActivity["notes"];

	@StringValidation()
	exerciseName!: PrismaProgramActivity["exerciseName"];

	@StringValidationOptional({ nullable: true })
	exerciseDescription!: PrismaProgramActivity["exerciseDescription"];

	@NumberValidation()
	exerciseDuration!: PrismaProgramActivity["exerciseDuration"];

	@NumberValidation()
	exerciseCount!: PrismaProgramActivity["exerciseCount"];

	@UUIDValidationOptional({ nullable: true })
	imageFileId!: PrismaProgramActivity["imageFileId"];

	@UUIDValidationOptional({ nullable: true })
	videoFileId!: PrismaProgramActivity["videoFileId"];
}
