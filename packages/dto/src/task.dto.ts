import { ClassField, UUIDField } from "@cocrepo/decorator";
import { Task as TaskEntity } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { ActivityDto } from "./activity.dto";
import { ExerciseDto } from "./exercise.dto";

export class TaskDto extends AbstractDto implements TaskEntity {
	@UUIDField()
	tenantId: string;

	@ClassField(() => ExerciseDto)
	exercise?: ExerciseDto;

	@ClassField(() => ActivityDto, { isArray: true })
	activities?: ActivityDto[];
}
