import { ClassField } from "@cocrepo/decorator/field";
import { Task } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";
import { ActivityDto } from "../activity.dto";
import { ExerciseDto } from "../exercise.dto";

export class CreateTaskDto extends PickType(Task, [
	"spaceId",
	"createdById",
] as const) {
	// 중첩 요청은 기존 공개 DTO 계약을 유지합니다.
	@ClassField(() => ExerciseDto)
	exercise?: ExerciseDto;
	@ClassField(() => ActivityDto, { isArray: true })
	activities?: ActivityDto[];
}
