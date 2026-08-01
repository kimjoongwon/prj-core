import {
	ClassField,
	NumberField,
	StringFieldOptional,
	ULIDField,
} from "@cocrepo/decorator";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Activity as ActivityEntity } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { RoutineDto } from "./routine.dto";
import { TaskDto } from "./task.dto";

export class ActivityDto
	extends AbstractDto
	implements DomainEntityModel<ActivityEntity>
{
	@ULIDField()
	routineId: string;

	@ULIDField()
	taskId: string;

	@NumberField()
	order: number;

	@NumberField()
	repetitions: number;

	@NumberField()
	restTime: number;

	@StringFieldOptional()
	notes: string | null;

	@ClassField(() => RoutineDto)
	routine?: RoutineDto;

	@ClassField(() => TaskDto)
	task?: TaskDto;
}
