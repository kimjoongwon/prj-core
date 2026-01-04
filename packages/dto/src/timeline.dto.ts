import {
	ClassField,
	StringField,
	StringFieldOptional,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import type { Timeline } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { SessionDto } from "./session.dto";

export class TimelineDto extends AbstractDto implements Timeline {
	@UUIDField()
	spaceId: string;

	@UUIDFieldOptional()
	creatorId: string | null;

	@StringField()
	name: string;

	@StringFieldOptional()
	description: string | null;

	@ClassField(() => SessionDto, { isArray: true })
	sessions?: SessionDto[];
}
