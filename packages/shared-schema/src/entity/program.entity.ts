import { Program as ProgramEntity } from "@prisma/client";
import { UseDto } from "../decorator/use-dto.decorator";
import { ProgramDto } from "../dto";
import { AbstractEntity } from "./abstract.entity";

@UseDto(ProgramDto)
export class Program
	extends AbstractEntity<ProgramDto>
	implements ProgramEntity
{
	instructorId: string;
	capacity: number;
	routineId: string;
	sessionId: string;
	tenancyId: string;
}
