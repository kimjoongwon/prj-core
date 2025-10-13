import { PartialType } from "@nestjs/swagger";
import { CreateExerciseDto } from "../create";

export class UpdateExerciseDto extends PartialType(CreateExerciseDto) {}
