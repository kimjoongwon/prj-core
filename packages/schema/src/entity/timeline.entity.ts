import { Timeline as TimelineEntity } from "@prisma/client";
import { UseDto } from "../decorator/use-dto.decorator";
import { TimelineDto } from "../dto/timeline.dto";
import { AbstractEntity } from "./abstract.entity";
import { Session } from "./session.entity";

@UseDto(TimelineDto)
export class Timeline
	extends AbstractEntity<TimelineDto>
	implements TimelineEntity
{
	tenantId: string;
	name: string;
	description: string | null;

	sessions?: Session[];
}
