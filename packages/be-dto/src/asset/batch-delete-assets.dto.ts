import { BigIntIdField } from "@cocrepo/decorator/field";

/**
 * 에셋 일괄 삭제 요청 DTO
 */
export class BatchDeleteAssetsDto {
	@BigIntIdField({
		each: true,
		description: "삭제할 에셋 ID 목록",
	})
	assetIds!: bigint[];
}
