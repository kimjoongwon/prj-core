import { ULIDFieldOptional } from "@cocrepo/decorator/field";
import { Program } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";

export class UpdateProgramDto extends PartialType(
	PickType(Program, ["capacity", "name", "level"] as const),
) {
	@ULIDFieldOptional({ nullable: true, description: "루틴 ULID" })
	routineId?: string | null;

	@ULIDFieldOptional({ nullable: true, description: "강사 사용자 ULID" })
	instructorId?: string | null;
}
