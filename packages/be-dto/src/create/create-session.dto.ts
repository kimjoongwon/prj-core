import { Session } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

export class CreateSessionDto extends PickType(Session, [
	"type",
	"repeatCycleType",
	"startDateTime",
	"endDateTime",
	"recurringDayOfWeek",
	"timelineSeq",
	"name",
	"description",
] as const) {}
