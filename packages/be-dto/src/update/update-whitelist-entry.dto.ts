import { WhitelistEntry } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";

/**
 * 화이트리스트 항목 수정 DTO
 */
export class UpdateWhitelistEntryDto extends PartialType(
	PickType(WhitelistEntry, [
		"type",
		"value",
		"description",
		"isActive",
	] as const),
) {}
