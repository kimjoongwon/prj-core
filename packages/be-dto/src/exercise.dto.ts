import { Exercise } from "@cocrepo/entity";
import { EntityResponseType } from "./mapped-types";
import { TaskDto } from "./task.dto";

export class ExerciseDto extends EntityResponseType(Exercise, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"duration",
		"count",
		"taskSeq",
		"description",
		"imageFileId",
		"videoFileId",
		"name",
		"task",
	] as const,
	relations: {
		task: () => TaskDto,
	},
}) {
	declare task?: TaskDto;
}
