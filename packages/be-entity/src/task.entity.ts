import type { Task as TaskEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Activity } from "./activity.entity";
import type { Exercise } from "./exercise.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

export class Task extends AbstractEntity implements TaskEntity {
	spaceId!: string;
	createdById!: string | null;

	space?: Space;
	createdBy?: User;
	exercise?: Exercise;
	activities?: Activity[];
}
