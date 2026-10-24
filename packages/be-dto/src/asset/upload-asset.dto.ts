import { ULIDField } from "@cocrepo/decorator/field";

/**
 * 에셋 업로드 DTO
 */
export class UploadAssetDto {
	@ULIDField({
		description: "업로드 대상 폴더 공개 ID (ULID)",
		example: "01JFOLDER00000000000000000A",
	})
	folderId!: string;
}
