import { ULIDField } from "@cocrepo/decorator";

/**
 * 에셋 업로드 DTO
 */
export class UploadAssetDto {
	@ULIDField({ description: "업로드 대상 폴더 ID" })
	folderId!: string;
}
