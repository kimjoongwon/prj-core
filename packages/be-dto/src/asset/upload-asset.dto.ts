import { BigIntIdField } from "@cocrepo/decorator/field";

/**
 * 에셋 업로드 DTO
 */
export class UploadAssetDto {
	@BigIntIdField({ description: "업로드 대상 폴더 ID" })
	folderId!: bigint;
}
