import { Timeline } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";

export class UpdateTimelineDto extends PartialType(
	PickType(Timeline, ["name", "description"] as const),
) {}
