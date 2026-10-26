import { ClassField } from "@cocrepo/decorator/field";
import { Session } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { ProgramDto } from "../program.dto";
import { TimelineDto } from "../timeline.dto";

export class UpdateSessionDto extends PartialType(
	PickType(Session, [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"type",
		"repeatCycleType",
		"startDateTime",
		"endDateTime",
		"recurringDayOfWeek",
		"timelineId",
		"name",
		"description",
	] as const),
) {
	// 기존 Session 수정 요청의 공개 중첩 타입을 유지합니다.
	@IsOptional()
	@ClassField(() => ProgramDto, { isArray: true, required: false })
	programs?: ProgramDto[];

	@IsOptional()
	@ClassField(() => TimelineDto, { required: false })
	timeline?: TimelineDto;
}
