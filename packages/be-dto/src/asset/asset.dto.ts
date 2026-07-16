import {
	ClassField,
	EnumField,
	NumberField,
	StringField,
	StringFieldOptional,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import { AssetKind, AssetStatus, type Prisma } from "@cocrepo/prisma";
import { AbstractDto } from "../abstract.dto";
import { FolderDto } from "../folder/folder.dto";

/**
 * 에셋 DTO
 */
export class AssetDto extends AbstractDto {
	@UUIDField({ description: "소속 Space ID" })
	spaceId!: string;

	@UUIDField({ description: "소속 폴더 ID" })
	folderId!: string;

	@EnumField(() => AssetKind, {
		description: "에셋 종류 (IMAGE, VIDEO, DOCUMENT)",
	})
	kind!: AssetKind;

	@EnumField(() => AssetStatus, {
		description: "에셋 상태 (UPLOADING, READY, FAILED)",
	})
	status!: AssetStatus;

	@StringField({ description: "원본 파일명" })
	originalName!: string;

	@StringField({ description: "스토리지 저장 키" })
	storageKey!: string;

	@StringField({ description: "MIME 타입" })
	mimeType!: string;

	@NumberField({ description: "파일 크기 (바이트)", int: true })
	sizeBytes!: number;

	@StringFieldOptional({ nullable: true, description: "파일 확장자" })
	extension!: string | null;

	@StringFieldOptional({
		nullable: true,
		description: "체크섬 (무결성 검증용)",
	})
	checksum!: string | null;

	@ClassField(() => Object, {
		required: false,
		description: "메타데이터 (Exif, 동영상 길이 등)",
	})
	metadata!: Prisma.JsonValue | null;

	@UUIDFieldOptional({ nullable: true, description: "생성자 ID" })
	createdById!: string | null;

	@StringFieldOptional({
		nullable: true,
		description: "공개 접근 가능한 에셋 URL",
	})
	publicUrl!: string | null;

	// 관계 필드
	@ClassField(() => FolderDto, { required: false, description: "소속 폴더" })
	folder?: FolderDto;

	// DerivativeDto는 순환 참조 방지를 위해 지연 로딩 패턴 사용
	@ClassField(() => require("../derivative/derivative.dto").DerivativeDto, {
		isArray: true,
		required: false,
		description: "파생 리소스 목록",
	})
	derivatives?: import("../derivative/derivative.dto").DerivativeDto[];
}
