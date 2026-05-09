import { PartialType } from "@nestjs/swagger";
import { CreateCourseDto } from "../create";

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
