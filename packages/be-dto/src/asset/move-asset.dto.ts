import { BigIntIdField } from "@cocrepo/decorator/field";

/**
 * 에셋 이동 DTO (폴더 변경)
 */
export class MoveAssetDto {
	@BigIntIdField({ description: "이동할 대상 폴더 ID" })
	targetFolderId!: bigint;
}
