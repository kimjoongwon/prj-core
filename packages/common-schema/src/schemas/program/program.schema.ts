import type { Program as PrismaProgram } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	NumberValidation,
	StringValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Program의 DB 필드 타입과 공통 검증입니다. */
export class ProgramSchema extends AbstractSchema implements PrismaProgram {
	programId!: PrismaProgram["programId"];

	@BigIntIdValidation()
	routineId!: PrismaProgram["routineId"];

	@BigIntIdValidation()
	sessionId!: PrismaProgram["sessionId"];

	@BigIntIdValidation()
	instructorId!: PrismaProgram["instructorId"];

	@NumberValidation()
	capacity!: PrismaProgram["capacity"];

	@StringValidation()
	name!: PrismaProgram["name"];

	@StringValidationOptional({ nullable: true })
	level!: PrismaProgram["level"];

	@StringValidationOptional({ nullable: true })
	routineNameSnapshot!: PrismaProgram["routineNameSnapshot"];

	@StringValidationOptional({ nullable: true })
	routineLabelSnapshot!: PrismaProgram["routineLabelSnapshot"];
}
