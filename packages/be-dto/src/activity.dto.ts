import { Activity } from "@cocrepo/entity";
import { EntityResponseType } from "./mapped-types";
import { RoutineDto } from "./routine.dto";
import { TaskDto } from "./task.dto";

export class ActivityDto extends EntityResponseType(Activity, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"routineId",
		"taskId",
		"order",
		"repetitions",
		"restTime",
		"notes",
		"routine",
		"task",
	] as const,
	relations: {
		routine: () => RoutineDto,
		task: () => TaskDto,
	},
}) {
	declare routine?: RoutineDto;
	declare task?: TaskDto;
}
