import type { Task as TaskEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Activity } from "./activity.entity";
import type { Exercise } from "./exercise.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

export class Task extends AbstractEntity implements TaskEntity {
	tenantId!: string;
	spaceId!: string;
	creatorId!: string | null;

	space?: Space;
	creator?: User;
	exercise?: Exercise;
	activities?: Activity[];
}
