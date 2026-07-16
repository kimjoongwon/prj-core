import type { Routine as RoutineEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Activity } from "./activity.entity";
import type { Program } from "./program.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

export class Routine extends AbstractEntity implements RoutineEntity {
	name!: string;
	label!: string;
	spaceId!: string;
	createdById!: string | null;

	space?: Space;
	createdBy?: User | null;
	programs?: Program[];
	activities?: Activity[];
}
