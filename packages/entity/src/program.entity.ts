import type { Program as ProgramEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Routine } from "./routine.entity";
import type { Session } from "./session.entity";

export class Program extends AbstractEntity implements ProgramEntity {
	routineId!: string;
	sessionId!: string;
	instructorId!: string;
	capacity!: number;
	name!: string;
	level!: string | null;

	routine?: Routine;
	session?: Session;
}
