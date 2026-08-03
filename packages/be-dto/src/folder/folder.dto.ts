import {
	BigIntIdField,
	BigIntIdFieldOptional,
	ClassField,
	NumberField,
	StringField,
} from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Folder } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractDto } from "../abstract.dto";

/**
 * 폴더 DTO
 */
export class FolderDto
	extends AbstractDto
	implements DomainEntityModel<Folder, "folderId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly folderId?: never;

	@BigIntIdField({ description: "소속 Space ID" })
	spaceId!: bigint;

	@BigIntIdFieldOptional({
		nullable: true,
		description: "부모 폴더 ID (루트면 null)",
	})
	parentFolderId!: bigint | null;

	@StringField({ description: "폴더명" })
	name!: string;

	@StringField({ description: "전체 경로 (예: /images/2024)" })
	path!: string;

	@NumberField({ description: "정렬 순서", int: true })
	sortOrder!: number;

	@BigIntIdFieldOptional({ nullable: true, description: "생성자 ID" })
	createdById!: bigint | null;

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
