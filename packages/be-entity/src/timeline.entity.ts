import type { Timeline as TimelineEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Session } from "./session.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

export class Timeline extends AbstractEntity implements TimelineEntity {
	tenantId!: string;
	spaceId!: string;
	creatorId!: string | null;
	name!: string;
	description!: string | null;

	space?: Space;
	creator?: User;
	sessions?: Session[];
}
