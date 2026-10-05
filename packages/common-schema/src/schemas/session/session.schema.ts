import {
	RecurringDayOfWeek,
	RepeatCycleTypes,
	SessionTypes,
} from "@cocrepo/enum";
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
export class SessionSchema extends AbstractSchema {
	sessionId!: string;

	@EnumValidation(() => SessionTypes)
	type!: SessionTypes;

	@EnumValidationOptional(() => RepeatCycleTypes, { nullable: true })
	repeatCycleType!: RepeatCycleTypes | null;

	@DateValidationOptional({ nullable: true })
	startDateTime!: Date | null;

	@DateValidationOptional({ nullable: true })
	endDateTime!: Date | null;

	@EnumValidationOptional(() => RecurringDayOfWeek, { nullable: true })
	recurringDayOfWeek!: RecurringDayOfWeek | null;

	@BigIntIdValidation()
	timelineId!: bigint;

	@StringValidation()
	name!: string;

	@StringValidationOptional({ nullable: true })
	description!: string | null;
}
