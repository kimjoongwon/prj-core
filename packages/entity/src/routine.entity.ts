import type { Routine as RoutineEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Activity } from "./activity.entity";
import type { Program } from "./program.entity";

export class Routine extends AbstractEntity implements RoutineEntity {
	name!: string;
	label!: string;

	programs?: Program[];
	activities?: Activity[];
}
