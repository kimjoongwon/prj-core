import { UUIDFieldOptional } from "@cocrepo/decorator";

/**
 * 폴더 이동 DTO
 */
export class MoveFolderDto {
	@UUIDFieldOptional({
		nullable: true,
		description: "이동할 대상 폴더 ID (null이면 루트로 이동)",
	})
	targetFolderId?: string | null;
}
