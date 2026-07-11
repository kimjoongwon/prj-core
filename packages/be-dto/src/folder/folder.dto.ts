import {
	ClassField,
	NumberField,
	StringField,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import type { Folder } from "@cocrepo/prisma";
import { AbstractDto } from "../abstract.dto";

/**
 * 폴더 DTO
 */
export class FolderDto extends AbstractDto implements Folder {
	@UUIDField({ description: "소속 Space ID" })
	spaceId!: string;

	@UUIDFieldOptional({
		nullable: true,
		description: "부모 폴더 ID (루트면 null)",
	})
	parentFolderId!: string | null;

	@StringField({ description: "폴더명" })
	name!: string;

	@StringField({ description: "전체 경로 (예: /images/2024)" })
	path!: string;

	@NumberField({ description: "정렬 순서", int: true })
	sortOrder!: number;

	@UUIDFieldOptional({ nullable: true, description: "생성자 ID" })
	creatorId!: string | null;

	// 관계 필드
	@ClassField(() => FolderDto, { required: false, description: "부모 폴더" })
	parent?: FolderDto;

	@ClassField(() => FolderDto, {
		isArray: true,
		required: false,
		description: "하위 폴더 목록",
	})
	children?: FolderDto[];
}
