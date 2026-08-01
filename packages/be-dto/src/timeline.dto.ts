import {
	ClassField,
	StringField,
	StringFieldOptional,
	ULIDField,
	ULIDFieldOptional,
} from "@cocrepo/decorator";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Timeline } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { SessionDto } from "./session.dto";

export class TimelineDto
	extends AbstractDto
	implements DomainEntityModel<Timeline>
{
	@ULIDField()
	spaceId: string;

	@ULIDFieldOptional({ nullable: true })
	createdById: string | null;

	@StringField()
	name: string;

	@StringFieldOptional()
	description: string | null;

	@ClassField(() => SessionDto, { isArray: true })
	sessions?: SessionDto[];
}
