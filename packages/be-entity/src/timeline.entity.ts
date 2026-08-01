import type { Timeline as TimelineEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { DomainEntityModel } from "./domain-entity-model.type";
import type { Session } from "./session.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

export class Timeline
	extends AbstractEntity
	implements DomainEntityModel<TimelineEntity>
{
	spaceId!: string;
	createdById!: string | null;
	name!: string;
	description!: string | null;

	space?: Space;
	createdBy?: User;
	sessions?: Session[];
}
