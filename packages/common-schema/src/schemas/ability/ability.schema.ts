import type { Ability as PrismaAbility } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	BooleanValidation,
	ClassValidation,
	StringValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Ability의 DB 필드 타입과 공통 검증입니다. */
export class AbilitySchema extends AbstractSchema implements PrismaAbility {
	abilityId!: PrismaAbility["abilityId"];

	@StringValidation()
	name!: PrismaAbility["name"];

	@StringValidationOptional({ nullable: true })
	description!: PrismaAbility["description"];

	@StringValidation({ each: true })
	fields!: PrismaAbility["fields"];

	@ClassValidation({ required: false, nullable: true })
	conditions!: PrismaAbility["conditions"];

	@BooleanValidation()
	inverted!: PrismaAbility["inverted"];

	@StringValidationOptional({ nullable: true })
	reason!: PrismaAbility["reason"];

	@BigIntIdValidation()
	subjectId!: PrismaAbility["subjectId"];

	@BigIntIdValidation()
	actionId!: PrismaAbility["actionId"];
}
