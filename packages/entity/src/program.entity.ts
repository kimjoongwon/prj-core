import { Program as ProgramEntity } from "@prisma/client";
import { AbstractEntity } from "./abstract.entity";
import { Routine } from "./routine.entity";
import { Session } from "./session.entity";

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
