import { ClassField, UUIDField, UUIDFieldOptional } from "@cocrepo/decorator";
import type { Task as TaskEntity } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { ActivityDto } from "./activity.dto";
import { ExerciseDto } from "./exercise.dto";

export class TaskDto extends AbstractDto implements TaskEntity {
	@UUIDField()
	spaceId: string;

	@UUIDFieldOptional()
	creatorId: string | null;

	@ClassField(() => ExerciseDto)
	exercise?: ExerciseDto;

	@ClassField(() => ActivityDto, { isArray: true })
	activities?: ActivityDto[];
}
