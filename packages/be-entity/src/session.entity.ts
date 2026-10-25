import {
	BigIntIdFieldMetadata,
	ClassField,
	DateFieldOptionalMetadata,
	EnumFieldMetadata,
	EnumFieldOptionalMetadata,
	StringFieldMetadata,
	StringFieldOptionalMetadata,
} from "@cocrepo/decorator/field";
import {
	RecurringDayOfWeek,
	RepeatCycleTypes,
	RepeatCycleTypesLabel,
	SessionTypes,
	SessionTypesLabel,
} from "@cocrepo/enum";
import { SessionSchema } from "@cocrepo/schema";
import { Transform } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Program } from "./program.entity";
import { Timeline } from "./timeline.entity";

@AbstractEntityFields()
export class Session extends SessionSchema {
	/** 공개 식별자 ULID */
	declare id: SessionSchema["id"];

	@EnumFieldMetadata(() => SessionTypes)
	@Transform(
		({ value }) =>
			typeof value === "string"
				? (SessionTypesLabel[value as SessionTypes] ?? value)
				: value,
		{ toPlainOnly: true },
	)
	declare type: SessionSchema["type"];
	@EnumFieldOptionalMetadata(() => RepeatCycleTypes, { nullable: true })
	@Transform(
		({ value }) =>
			typeof value === "string"
				? (RepeatCycleTypesLabel[value as RepeatCycleTypes] ?? value)
				: value,
		{ toPlainOnly: true },
	)
	declare repeatCycleType: SessionSchema["repeatCycleType"];
	@DateFieldOptionalMetadata({ nullable: true })
	declare startDateTime: SessionSchema["startDateTime"];
	@DateFieldOptionalMetadata({ nullable: true })
	declare endDateTime: SessionSchema["endDateTime"];
	@EnumFieldOptionalMetadata(() => RecurringDayOfWeek, { nullable: true })
	declare recurringDayOfWeek: SessionSchema["recurringDayOfWeek"];
	@BigIntIdFieldMetadata() declare timelineSeq: SessionSchema["timelineSeq"];
	@StringFieldMetadata() declare name: SessionSchema["name"];
	@StringFieldOptionalMetadata({ nullable: true })
	declare description: SessionSchema["description"];

	@ClassField(() => Program, { isArray: true })
	programs?: Program[];
	@ClassField(() => Timeline) timeline?: Timeline;
}
