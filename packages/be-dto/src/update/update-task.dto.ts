import { ClassField } from "@cocrepo/decorator/field";
import { Task } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { ActivityDto } from "../activity.dto";
import { ExerciseDto } from "../exercise.dto";

export class UpdateTaskDto extends PartialType(
	PickType(Task, ["spaceId", "createdById"] as const),
) {
	// 중첩 요청은 기존 공개 DTO 계약을 유지합니다.
	@IsOptional()
	@ClassField(() => ExerciseDto, { required: false })
	exercise?: ExerciseDto;
	@IsOptional()
	@ClassField(() => ActivityDto, { isArray: true, required: false })
	activities?: ActivityDto[];
}
