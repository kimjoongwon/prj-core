import {
	ULIDField, StringField } from "@cocrepo/decorator/field";
import { Session } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

export class CreateSessionDto extends PickType(Session, [
	"type",
	"repeatCycleType",
	"startDateTime",
	"endDateTime",
	"recurringDayOfWeek",
	"name",
	"description",
] as const) {
	@ULIDField({ description: "타임라인 공개 ID (ULID)" })
	timelineId!: string;
}
