import type { Timeline as TimelineEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Session } from "./session.entity";
import type { Tenant } from "./tenant.entity";
import type { User } from "./user.entity";

export class Timeline extends AbstractEntity implements TimelineEntity {
	tenantId!: string;
	creatorId!: string | null;
	name!: string;
	description!: string | null;

	tenant?: Tenant;
	creator?: User;
	sessions?: Session[];
}
