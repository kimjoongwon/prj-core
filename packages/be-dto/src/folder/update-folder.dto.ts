import { StringField, ULIDFieldOptional } from "@cocrepo/decorator/field";
import { IsOptional } from "class-validator";

/**
 * 폴더 생성 DTO
 */
export class UpdateFolderDto {
	@ULIDFieldOptional({
		nullable: true,
		description: "상위 폴더 ULID (루트면 null)",
	})
	parentFolderId?: string | null;

	@IsOptional()
	@StringField({
		description: "폴더명",
		required: false,
		maxLength: 100,
		pattern: '^[^\\\\/:*?"<>|]+$',
		message: "폴더명에 특수문자를 사용할 수 없습니다",
	})
	name?: string;
}
