import { Task as TaskEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import { Activity } from "./activity.entity";
import { Exercise } from "./exercise.entity";
import { Space } from "./space.entity";
import { User } from "./user.entity";

export class Task extends AbstractEntity implements TaskEntity {
	spaceId!: string;
	creatorId!: string | null;

	space?: Space;
	creator?: User;
	exercise?: Exercise;
	activities?: Activity[];
}
