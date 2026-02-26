import { UUIDField } from "@cocrepo/decorator";

/**
 * 에셋 일괄 삭제 요청 DTO
 */
export class BatchDeleteAssetsDto {
	@UUIDField({
		each: true,
		description: "삭제할 에셋 ID 목록",
	})
	assetIds!: string[];
}
