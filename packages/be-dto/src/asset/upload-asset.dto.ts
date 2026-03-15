import { UUIDField } from "@cocrepo/decorator";

/**
 * 에셋 업로드 DTO
 */
export class UploadAssetDto {
  @UUIDField({ description: "업로드 대상 폴더 ID" })
  folderId!: string;
}
