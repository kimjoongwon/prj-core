import { OmitType } from "@nestjs/swagger";
import { WhitelistEntryDto } from "../whitelist-entry.dto";

/**
 * 화이트리스트 항목 생성 DTO
 */
export class CreateWhitelistEntryDto extends OmitType(WhitelistEntryDto, [
	"id",
	"createdAt",
	"updatedAt",
]) {}
