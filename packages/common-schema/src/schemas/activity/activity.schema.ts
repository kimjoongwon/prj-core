import {
	BigIntIdValidation,
	NumberValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Activity의 DB 필드 타입과 공통 검증입니다. */
export class ActivitySchema extends AbstractSchema {
	activityId!: string;

	@BigIntIdValidation()
	routineId!: bigint;

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
}
