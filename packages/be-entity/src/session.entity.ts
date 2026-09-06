import {
	BigIntIdField,
	ClassField,
	DateFieldOptional,
	EnumField,
	EnumFieldOptional,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import {
	RepeatCycleTypesLabel,
	SessionTypesLabel,
} from "@cocrepo/enum";
import { RecurringDayOfWeek, RepeatCycleTypes, SessionTypes } from "@cocrepo/enum";
import { Exclude, Transform } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { Program } from "./program.entity";
import { Timeline } from "./timeline.entity";

export class Session extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true }) sessionId!: string;

	@EnumField(() => SessionTypes)
	@Transform(
		({ value }) =>
			typeof value === "string"
				? (SessionTypesLabel[value as SessionTypes] ?? value)
				: value,
		{ toPlainOnly: true },
	)
	type!: SessionTypes;
	@EnumFieldOptional(() => RepeatCycleTypes, { nullable: true })
	@Transform(
		({ value }) =>
			typeof value === "string"
				? (RepeatCycleTypesLabel[value as RepeatCycleTypes] ?? value)
				: value,
		{ toPlainOnly: true },
	)
	repeatCycleType!: RepeatCycleTypes | null;
	@DateFieldOptional({ nullable: true }) startDateTime!: Date | null;
	@DateFieldOptional({ nullable: true }) endDateTime!: Date | null;
	@EnumFieldOptional(() => RecurringDayOfWeek, { nullable: true })
	recurringDayOfWeek!: RecurringDayOfWeek | null;
	@BigIntIdField() timelineId!: bigint;
	@StringField() name!: string;
	@StringFieldOptional({ nullable: true }) description!: string | null;

	@ClassField(() => Program, { isArray: true })
	programs?: Program[];
	@ClassField(() => Timeline) timeline?: Timeline;
}
