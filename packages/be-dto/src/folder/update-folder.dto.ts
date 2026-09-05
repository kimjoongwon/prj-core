import { StringField } from "@cocrepo/decorator/field";
import { Folder } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

/**
 * 폴더 생성 DTO
 */
export class UpdateFolderDto extends PartialType(
	PickType(Folder, ["parentFolderId"] as const),
) {
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
