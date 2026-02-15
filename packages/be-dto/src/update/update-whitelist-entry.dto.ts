import { PartialType } from "@nestjs/swagger";
import { CreateWhitelistEntryDto } from "../create";

/**
 * 화이트리스트 항목 수정 DTO
 */
export class UpdateWhitelistEntryDto extends PartialType(
	CreateWhitelistEntryDto,
) {}
