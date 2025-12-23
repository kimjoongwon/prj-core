import {
	ClassField,
	StringField,
	StringFieldOptional,
	UUIDField,
} from "@cocrepo/decorator";
import { Timeline } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { SessionDto } from "./session.dto";

export class TimelineDto extends AbstractDto implements Timeline {
	@UUIDField()
	tenantId: string;

	@StringField()
	name: string;

	@StringFieldOptional()
	description: string | null;

	@ClassField(() => SessionDto, { isArray: true })
	sessions?: SessionDto[];
}
