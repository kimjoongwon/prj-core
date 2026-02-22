import { NumberField, StringField, UUIDField, UUIDFieldOptional } from "@cocrepo/decorator";
import { Folder } from "@cocrepo/entity";
import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../constant";
import { FolderDto } from "./folder.dto";

/**
 * 폴더 생성 DTO
 */
export class CreateFolderDto extends OmitType(FolderDto, [
	...COMMON_ENTITY_FIELDS,
	"parent",
	"children",
	"path", // path는 서버에서 계산
] as const) {
	/**
	 * DTO -> Entity 변환
	 */
	toEntity(): Folder {
		const folder = new Folder();
		folder.spaceId = this.spaceId;
		folder.parentFolderId = this.parentFolderId ?? null;
		folder.name = this.name;
		folder.sortOrder = this.sortOrder;
		folder.creatorId = this.creatorId ?? null;
		// path는 서비스 레이어에서 계산
		return folder;
	}
}
