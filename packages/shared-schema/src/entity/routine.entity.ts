import { Routine as RoutineEntity } from "@prisma/client";
import { UseDto } from "../decorator/use-dto.decorator";
import { RoutineDto } from "../dto";
import { AbstractEntity } from "./abstract.entity";
import { Activity } from "./activity.entity";
import { Program } from "./program.entity";

@UseDto(RoutineDto)
export class Routine
	extends AbstractEntity<RoutineDto>
	implements RoutineEntity
{
	name: string;
	label: string;

	programs?: Program[];
	activities?: Activity[];
}
