import { Routine as RoutineEntity } from "@prisma/client";
import { AbstractEntity } from "./abstract.entity";
import { Activity } from "./activity.entity";
import { Program } from "./program.entity";

export class Routine extends AbstractEntity implements RoutineEntity {
	name!: string;
	label!: string;

	programs?: Program[];
	activities?: Activity[];
}
