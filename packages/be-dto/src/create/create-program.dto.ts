import { ULIDField } from "@cocrepo/decorator/field";
import { Program } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

export class CreateProgramDto extends PickType(Program, [
	"capacity",
	"name",
	"level",
] as const) {
	@ULIDField({ description: "루틴 공개 ID (ULID)" })
	routineId!: string;

	@ULIDField({ description: "강사 공개 ID (ULID)" })
	instructorId!: string;
}
