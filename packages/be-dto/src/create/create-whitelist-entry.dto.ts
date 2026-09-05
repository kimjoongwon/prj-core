import { WhitelistEntry } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

/**
 * 화이트리스트 항목 생성 DTO
 */
export class CreateWhitelistEntryDto extends PickType(WhitelistEntry, [
	"type",
	"value",
	"description",
	"isActive",
] as const) {}
