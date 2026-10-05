import { Timeline } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

export class CreateTimelineDto extends PickType(Timeline, [
	"name",
	"description",
] as const) {}
