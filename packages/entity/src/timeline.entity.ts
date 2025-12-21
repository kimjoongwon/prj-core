import { Timeline as TimelineEntity } from "@prisma/client";
import { AbstractEntity } from "./abstract.entity";
import { Session } from "./session.entity";

export class Timeline extends AbstractEntity implements TimelineEntity {
	tenantId!: string;
	name!: string;
	description!: string | null;

	sessions?: Session[];
}
