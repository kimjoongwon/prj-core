import {
	BigIntIdValidation,
	NumberValidation,
	StringValidation,
	StringValidationOptional,
	UUIDValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Exercise의 DB 필드 타입과 공통 검증입니다. */
export class ExerciseSchema extends AbstractSchema {
	exerciseId!: string;

	@NumberValidation()
	duration!: number;

	@NumberValidation()
	count!: number;

	@BigIntIdValidation()
	taskId!: bigint;

	@StringValidationOptional({ nullable: true })
	description!: string | null;

	@UUIDValidationOptional({ nullable: true })
	imageFileId!: string | null;

	@UUIDValidationOptional({ nullable: true })
	videoFileId!: string | null;

	@StringValidation()
	name!: string;
}
