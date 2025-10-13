import { PartialType } from "@nestjs/swagger";
import { CreateProgramDto } from "../create/create-program.dto";

export class UpdateProgramDto extends PartialType(CreateProgramDto) {}
