import type { JsonValue } from "@cocrepo/type";
import {
	BigIntIdValidation,
	BooleanValidation,
	ClassValidation,
	StringValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Ability의 DB 필드 타입과 공통 검증입니다. */
export class AbilitySchema extends AbstractSchema {
	abilityId!: string;

	@StringValidation()
	name!: string;

	@StringValidationOptional({ nullable: true })
	description!: string | null;

	@StringValidation({ each: true })
	fields!: string[];

	@ClassValidation({ required: false, nullable: true })
	conditions!: JsonValue;

	@BooleanValidation()
	inverted!: boolean;

	@StringValidationOptional({ nullable: true })
	reason!: string | null;

	@BigIntIdValidation()
	subjectId!: bigint;

	@BigIntIdValidation()
	actionId!: bigint;
}
