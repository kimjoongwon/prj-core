import { Timeline as TimelineEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import { Session } from "./session.entity";

export class Timeline extends AbstractEntity implements TimelineEntity {
	tenantId!: string;
	name!: string;
	description!: string | null;

	sessions?: Session[];
}
