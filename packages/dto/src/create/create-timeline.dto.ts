import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../constant";
import { TimelineDto } from "../timeline.dto";

export class CreateTimelineDto extends OmitType(TimelineDto, [
	...COMMON_ENTITY_FIELDS,
	"sessions",
]) {}
