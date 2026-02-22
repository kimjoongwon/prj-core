import { Transform } from "class-transformer";
import { StringField, UUIDField } from "@cocrepo/decorator";

/**
 * 앨범에 에셋 추가 DTO
 */
export class AddAssetsToAlbumDto {
	@StringField({
		each: true,
		description: "추가할 에셋 ID 목록",
	})
	@Transform(({ value }) =>
		Array.isArray(value) ? value : value ? [value] : [],
	)
	assetIds!: string[];
}
