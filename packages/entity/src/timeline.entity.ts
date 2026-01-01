import { Timeline as TimelineEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import { Session } from "./session.entity";
import { Space } from "./space.entity";
import { User } from "./user.entity";

export class Timeline extends AbstractEntity implements TimelineEntity {
	spaceId!: string;
	creatorId!: string | null;
	name!: string;
	description!: string | null;

	space?: Space;
	creator?: User;
	sessions?: Session[];
}
