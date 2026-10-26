import { Task } from "@cocrepo/entity";
import { ActivityDto } from "./activity.dto";
import { ExerciseDto } from "./exercise.dto";
import { EntityResponseType } from "./mapped-types";

export class TaskDto extends EntityResponseType(Task, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"spaceId",
		"createdById",
		"exercise",
		"activities",
	] as const,
	relations: {
		exercise: () => ExerciseDto,
		activities: () => ActivityDto,
	},
}) {
	declare exercise?: ExerciseDto;
	declare activities?: ActivityDto[];
}
