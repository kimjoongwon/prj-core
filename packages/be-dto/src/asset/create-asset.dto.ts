import { Asset } from "@cocrepo/entity";
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
] as const) {
	/**
	 * DTO -> Entity 변환
	 */
	toEntity(): Asset {
		const asset = new Asset();
		asset.spaceId = this.spaceId;
		asset.folderId = this.folderId;
		asset.kind = this.kind;
		asset.status = this.status;
		asset.originalName = this.originalName;
		asset.storageKey = this.storageKey;
		asset.mimeType = this.mimeType;
		asset.sizeBytes = BigInt(this.sizeBytes);
		asset.extension = this.extension ?? null;
		asset.checksum = this.checksum ?? null;
		asset.metadata = this.metadata ?? null;
		asset.creatorId = this.creatorId ?? null;
		return asset;
	}
}
