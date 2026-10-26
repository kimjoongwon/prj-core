import { StringField } from "@cocrepo/decorator/field";
import { Folder } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

/**
 * 폴더 생성 DTO
 */
export class CreateFolderDto extends PickType(Folder, [
	"parentFolderId",
] as const) {
	@StringField({
		description: "폴더명",
		maxLength: 100,
		pattern: '^[^\\\\/:*?"<>|]+$',
		message: "폴더명에 특수문자를 사용할 수 없습니다",
	})
	name!: string;
}
