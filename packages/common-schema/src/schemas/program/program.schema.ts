import {
	BigIntIdValidation,
	NumberValidation,
	StringValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Program의 DB 필드 타입과 공통 검증입니다. */
export class ProgramSchema extends AbstractSchema {
	programId!: string;

	@BigIntIdValidation()
	routineId!: bigint;

	@BigIntIdValidation()
	sessionId!: bigint;

	@BigIntIdValidation()
	instructorId!: bigint;

	@NumberValidation()
	capacity!: number;

	@StringValidation()
	name!: string;

	@StringValidationOptional({ nullable: true })
	level!: string | null;

	@StringValidationOptional({ nullable: true })
	routineNameSnapshot!: string | null;

	@StringValidationOptional({ nullable: true })
	routineLabelSnapshot!: string | null;
}
