import { Program } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

export class CreateProgramDto extends PickType(Program, [
	"routineSeq",
	"instructorSeq",
	"capacity",
	"name",
	"level",
] as const) {}
