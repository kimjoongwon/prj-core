import { ULIDField } from "@cocrepo/decorator/field";

/**
 * 에셋 이동 DTO (폴더 변경)
 */
export class MoveAssetDto {
	@ULIDField({ description: "이동할 대상 폴더 공개 ID (ULID)" })
	targetFolderId!: string;
}
