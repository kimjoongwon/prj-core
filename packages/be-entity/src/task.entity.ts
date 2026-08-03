import { AbstractEntity } from "./abstract.entity";
import type { Activity } from "./activity.entity";
import type { Exercise } from "./exercise.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

export class Task extends AbstractEntity {
	/** 공개 식별자 ULID */
	taskId!: string;

	spaceId!: bigint;
	createdById!: bigint | null;

	space?: Space;
	createdBy?: User;
	exercise?: Exercise;
	activities?: Activity[];
}
