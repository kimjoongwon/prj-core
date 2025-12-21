import { PartialType } from "@nestjs/swagger";
import { CreateCategoryDto } from "../create";

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
