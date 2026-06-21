import type { Task as TaskEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Activity } from "./activity.entity";
import type { Exercise } from "./exercise.entity";
import type { Tenant } from "./tenant.entity";
import type { User } from "./user.entity";

export class Task extends AbstractEntity implements TaskEntity {
	tenantId!: string;
	creatorId!: string | null;

	tenant?: Tenant;
	creator?: User;
	exercise?: Exercise;
	activities?: Activity[];
}
