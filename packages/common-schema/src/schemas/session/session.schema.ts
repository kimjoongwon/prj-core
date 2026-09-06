import {
	RecurringDayOfWeek,
	RepeatCycleTypes,
	SessionTypes,
} from "@cocrepo/enum";
import type { Session as PrismaSession } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	DateValidationOptional,
	EnumValidation,
	EnumValidationOptional,
	StringValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Session의 DB 필드 타입과 공통 검증입니다. */
export class SessionSchema extends AbstractSchema implements PrismaSession {
	sessionId!: PrismaSession["sessionId"];

	@EnumValidation(() => SessionTypes)
	type!: PrismaSession["type"];

	@EnumValidationOptional(() => RepeatCycleTypes, { nullable: true })
	repeatCycleType!: PrismaSession["repeatCycleType"];

	@DateValidationOptional({ nullable: true })
	startDateTime!: PrismaSession["startDateTime"];

	@DateValidationOptional({ nullable: true })
	endDateTime!: PrismaSession["endDateTime"];

	@EnumValidationOptional(() => RecurringDayOfWeek, { nullable: true })
	recurringDayOfWeek!: PrismaSession["recurringDayOfWeek"];

	@BigIntIdValidation()
	timelineId!: PrismaSession["timelineId"];

	@StringValidation()
	name!: PrismaSession["name"];

	@StringValidationOptional({ nullable: true })
	description!: PrismaSession["description"];
}
