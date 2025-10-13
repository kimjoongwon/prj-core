import { Activity as ActivityEntity } from "@prisma/client";
import { UseDto } from "../decorator/use-dto.decorator";
import { ActivityDto } from "../dto/activity.dto";
import { AbstractEntity } from "./abstract.entity";
import { Routine } from "./routine.entity";
import { Task } from "./task.entity";

@UseDto(ActivityDto)
export class Activity
	extends AbstractEntity<ActivityDto>
	implements ActivityEntity
{
	routineId: string;
	taskId: string;
	order: number;
	repetitions: number;
	restTime: number;
	notes: string | null;

	routine?: Routine;
	task?: Task;
}
