import type { Routine as PrismaRoutine } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	BigIntIdValidationOptional,
	StringValidation,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Routine의 DB 필드 타입과 공통 검증입니다. */
export class RoutineSchema extends AbstractSchema implements PrismaRoutine {
	routineId!: PrismaRoutine["routineId"];

	@BigIntIdValidation()
	spaceId!: PrismaRoutine["spaceId"];

	@BigIntIdValidationOptional({ nullable: true })
	createdById!: PrismaRoutine["createdById"];

	@StringValidation()
	name!: PrismaRoutine["name"];

	@StringValidation()
	label!: PrismaRoutine["label"];
}
