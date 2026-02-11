import { PartialType } from "@nestjs/swagger";
import { CreateTaskDto } from "../create/create-task.dto";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
