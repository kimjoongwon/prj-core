import {
	BigIntIdValidation,
	BigIntIdValidationOptional,
	StringValidation,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Routine의 DB 필드 타입과 공통 검증입니다. */
export class RoutineSchema extends AbstractSchema {
	routineId!: string;

	@BigIntIdValidation()
	spaceId!: bigint;

	@BigIntIdValidationOptional({ nullable: true })
	createdById!: bigint | null;

	@StringValidation()
	name!: string;

	@StringValidation()
	label!: string;
}
