import { ClassField, ULIDField, ULIDFieldOptional } from "@cocrepo/decorator";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Task as TaskEntity } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { ActivityDto } from "./activity.dto";
import { ExerciseDto } from "./exercise.dto";

export class TaskDto
	extends AbstractDto
	implements DomainEntityModel<TaskEntity>
{
	@ULIDField()
	spaceId: string;

	@ULIDFieldOptional({ nullable: true })
	createdById: string | null;

	@ClassField(() => ExerciseDto)
	exercise?: ExerciseDto;

	@ClassField(() => ActivityDto, { isArray: true })
	activities?: ActivityDto[];
}
