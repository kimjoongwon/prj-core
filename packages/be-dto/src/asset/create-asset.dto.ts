import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../constant";
import { AssetDto } from "./asset.dto";

/**
 * 에셋 생성 DTO
 */
export class CreateAssetDto extends OmitType(AssetDto, [
	...COMMON_ENTITY_FIELDS,
	"derivatives",
	"folder",
] as const) {}
