import { AbstractEntity } from "./abstract.entity";
import type { Activity } from "./activity.entity";
import type { Program } from "./program.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

export class Routine extends AbstractEntity {
	/** 공개 식별자 ULID */
	routineId!: string;

	name!: string;
	label!: string;
	spaceId!: bigint;
	createdById!: bigint | null;

	space?: Space;
	createdBy?: User | null;
	programs?: Program[];
	activities?: Activity[];
}
