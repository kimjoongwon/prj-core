import type { Exercise as PrismaExercise } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	NumberValidation,
	StringValidation,
	StringValidationOptional,
	UUIDValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Exercise의 DB 필드 타입과 공통 검증입니다. */
export class ExerciseSchema extends AbstractSchema implements PrismaExercise {
	exerciseId!: PrismaExercise["exerciseId"];

	@NumberValidation()
	duration!: PrismaExercise["duration"];

	@NumberValidation()
	count!: PrismaExercise["count"];

	@BigIntIdValidation()
	taskId!: PrismaExercise["taskId"];

	@StringValidationOptional({ nullable: true })
	description!: PrismaExercise["description"];

	@UUIDValidationOptional({ nullable: true })
	imageFileId!: PrismaExercise["imageFileId"];

	@UUIDValidationOptional({ nullable: true })
	videoFileId!: PrismaExercise["videoFileId"];

	@StringValidation()
	name!: PrismaExercise["name"];
}
