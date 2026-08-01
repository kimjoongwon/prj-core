import type { Program as ProgramEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { DomainEntityModel } from "./domain-entity-model.type";
import type { ProgramActivity } from "./program-activity.entity";
import type { Routine } from "./routine.entity";
import type { Session } from "./session.entity";

export class Program
	extends AbstractEntity
	implements DomainEntityModel<ProgramEntity>
{
	routineId!: string;
	sessionId!: string;
	instructorId!: string;
	capacity!: number;
	name!: string;
	level!: string | null;
	routineNameSnapshot!: string | null;
	routineLabelSnapshot!: string | null;

	routine?: Routine;
	session?: Session;
	programActivities?: ProgramActivity[];
}
