import { Task as TaskEntity } from "@prisma/client";
import { AbstractEntity } from "./abstract.entity";
import { Activity } from "./activity.entity";
import { Exercise } from "./exercise.entity";

export class Task extends AbstractEntity implements TaskEntity {
	tenantId!: string;

	exercise?: Exercise;
	activities?: Activity[];
}
