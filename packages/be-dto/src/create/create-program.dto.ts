import { Program } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

export class CreateProgramDto extends PickType(Program, [
	"routineId",
	"instructorId",
	"capacity",
	"name",
	"level",
] as const) {}
