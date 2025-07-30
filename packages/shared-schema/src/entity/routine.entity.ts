import { Content, Routine as RoutineEntity } from "@prisma/client";
import { UseDto } from "../decorator/use-dto.decorator";
import { RoutineDto } from "../dto";
import { AbstractEntity } from "./abstract.entity";

@UseDto(RoutineDto)
export class Routine
	extends AbstractEntity<RoutineDto>
	implements RoutineEntity
{
	label: string;
	name: string;
	contentId: string;
	content: Content;
}
