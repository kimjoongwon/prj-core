import {
	NumberField,
	StringField,
	StringFieldOptional,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import { Album } from "@cocrepo/entity";
import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../constant";
import { AlbumDto } from "./album.dto";

/**
 * 앨범 생성 DTO
 */
export class CreateAlbumDto extends OmitType(AlbumDto, [
	...COMMON_ENTITY_FIELDS,
	"coverAsset",
] as const) {
	/**
	 * DTO -> Entity 변환
	 */
	toEntity(): Album {
		const album = new Album();
		album.spaceId = this.spaceId;
		album.name = this.name;
		album.description = this.description ?? null;
		album.sortOrder = this.sortOrder;
		album.coverAssetId = this.coverAssetId ?? null;
		album.creatorId = this.creatorId ?? null;
		return album;
	}
}
