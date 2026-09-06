import type { Activity as PrismaActivity } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	NumberValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Activity의 DB 필드 타입과 공통 검증입니다. */
export class ActivitySchema extends AbstractSchema implements PrismaActivity {
	activityId!: PrismaActivity["activityId"];

	@BigIntIdValidation()
	routineId!: PrismaActivity["routineId"];

	@BigIntIdValidation()
	taskId!: PrismaActivity["taskId"];

	@NumberValidation()
	order!: PrismaActivity["order"];

	@NumberValidation()
	repetitions!: PrismaActivity["repetitions"];

	@NumberValidation()
	restTime!: PrismaActivity["restTime"];

	@StringValidationOptional({ nullable: true })
	notes!: PrismaActivity["notes"];
}
