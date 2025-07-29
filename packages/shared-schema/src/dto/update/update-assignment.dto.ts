import { PartialType } from "@nestjs/swagger";
import { CreateAssignmentDto } from "../create";

export class UpdateAssignmentDto extends PartialType(CreateAssignmentDto) {}
