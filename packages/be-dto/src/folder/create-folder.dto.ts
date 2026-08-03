import { BigIntIdFieldOptional, StringField } from "@cocrepo/decorator/field";

/**
 * 폴더 생성 DTO
 */
export class CreateFolderDto {
	@BigIntIdFieldOptional({
		nullable: true,
		description: "부모 폴더 ID (루트면 null)",
	})
	parentFolderId?: bigint | null;

	@StringField({
		description: "폴더명",
		maxLength: 100,
		pattern: '^[^\\\\/:*?"<>|]+$',
		message: "폴더명에 특수문자를 사용할 수 없습니다",
	})
	name!: string;
}
