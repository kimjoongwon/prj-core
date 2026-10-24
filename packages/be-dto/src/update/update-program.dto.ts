import { Program } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";

export class UpdateProgramDto extends PartialType(
	PickType(Program, [
		"routineSeq",
		"instructorSeq",
		"capacity",
		"name",
		"level",
	] as const),
) {}
