import { Program as ProgramEntity } from "@prisma/client";
import { UseDto } from "../decorator/use-dto.decorator";
import { ProgramDto } from "../dto";
import { AbstractEntity } from "./abstract.entity";
import { Routine } from "./routine.entity";
import { Session } from "./session.entity";

@UseDto(ProgramDto)
export class Program
	extends AbstractEntity<ProgramDto>
	implements ProgramEntity
{
	routineId: string;
	sessionId: string;
	instructorId: string;
	capacity: number;
	name: string;
	level: string | null;

	routine?: Routine;
	session?: Session;
}
