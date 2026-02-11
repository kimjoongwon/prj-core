import { PartialType } from "@nestjs/swagger";
import { CreateActionDto } from "../create";

/**
 * Action 수정 DTO
 */
export class UpdateActionDto extends PartialType(CreateActionDto) {}
