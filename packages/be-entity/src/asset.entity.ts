import {
	BigIntIdFieldMetadata,
	BigIntIdFieldOptionalMetadata,
	ClassField,
	ClassFieldMetadata,
	EnumFieldMetadata,
	StringFieldMetadata,
	StringFieldOptionalMetadata,
} from "@cocrepo/decorator/field";
import { AssetKind, AssetStatus } from "@cocrepo/enum";
import { AssetSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Album } from "./album.entity";
import { AlbumEntry } from "./album-entry.entity";
import { Derivative } from "./derivative.entity";
import { Document } from "./document.entity";
import { Folder } from "./folder.entity";
import { Image } from "./image.entity";
import type { Space } from "./space.entity";
import { User } from "./user.entity";
import { Video } from "./video.entity";

@AbstractEntityFields()
export class Asset extends AssetSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare assetId: AssetSchema["assetId"];

	// ============================================================================
	// 필수 필드
	// ============================================================================
	@BigIntIdFieldMetadata({ description: "소속 Space ID" })
	declare spaceId: AssetSchema["spaceId"];
	@BigIntIdFieldMetadata({ description: "소속 폴더 ID" })
	declare folderId: AssetSchema["folderId"];
	@EnumFieldMetadata(() => AssetKind, {
		description: "에셋 종류 (IMAGE, VIDEO, DOCUMENT)",
	})
	declare kind: AssetSchema["kind"];
	@EnumFieldMetadata(() => AssetStatus, {
		description: "에셋 상태 (UPLOADING, READY, FAILED)",
	})
	declare status: AssetSchema["status"];
	@StringFieldMetadata({ description: "원본 파일명" })
	declare originalName: AssetSchema["originalName"];
	@StringFieldMetadata({ description: "스토리지 저장 키" })
	declare storageKey: AssetSchema["storageKey"];
	@StringFieldMetadata({ description: "MIME 타입" })
	declare mimeType: AssetSchema["mimeType"];
	@BigIntIdFieldMetadata({ description: "파일 크기 (바이트)" })
	declare sizeBytes: AssetSchema["sizeBytes"];

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	@StringFieldOptionalMetadata({ nullable: true, description: "파일 확장자" })
	declare extension: AssetSchema["extension"];
	@StringFieldOptionalMetadata({
		nullable: true,
		description: "체크섬 (무결성 검증용)",
	})
	declare checksum: AssetSchema["checksum"];
	@ClassFieldMetadata(() => Object, {
		required: false,
		nullable: true,
		description: "메타데이터 (Exif, 동영상 길이 등)",
	})
	declare metadata: AssetSchema["metadata"];
	@BigIntIdFieldOptionalMetadata({ nullable: true, description: "생성자 ID" })
	declare createdById: AssetSchema["createdById"];

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	space?: Space;
	@ClassField(() => Folder, { required: false, description: "소속 폴더" })
	folder?: Folder;
	@ClassField(() => User, { required: false, nullable: true })
	createdBy?: User | null;
	@ClassField(() => Image, { required: false, nullable: true })
	image?: Image | null;
	@ClassField(() => Video, { required: false, nullable: true })
	video?: Video | null;
	@ClassField(() => Document, { required: false, nullable: true })
	document?: Document | null;
	@ClassField(() => Derivative, {
		isArray: true,
		required: false,
		description: "파생 리소스 목록",
	})
	derivatives?: Derivative[];
	@ClassField(() => AlbumEntry, { required: false, each: true, isArray: true })
	albumEntries?: AlbumEntry[];
	@ClassField(() => Album, { required: false, each: true, isArray: true })
	coverOfAlbums?: Album[];

	// ============================================================================
	// 도메인 메서드
	// ============================================================================

	/**
	 * 업로드 완료 여부를 확인합니다
	 */
	isReady(): boolean {
		return this.status === "READY";
	}

	/**
	 * 이미지 타입인지 확인합니다
	 */
	isImage(): boolean {
		return this.kind === "IMAGE";
	}

	/**
	 * 비디오 타입인지 확인합니다
	 */
	isVideo(): boolean {
		return this.kind === "VIDEO";
	}

	/**
	 * 문서 타입인지 확인합니다
	 */
	isDocument(): boolean {
		return this.kind === "DOCUMENT";
	}

	/**
	 * 확장자를 반환합니다 (점 제외)
	 */
	getExtension(): string {
		if (this.extension) {
			return this.extension.replace(/^\./, "");
		}
		// extension 필드가 없으면 originalName에서 추출
		const parts = this.originalName.split(".");
		return parts.length > 1 ? parts.pop() || "" : "";
	}

	/**
	 * 사람이 읽기 쉬운 크기를 반환합니다 (예: "2.4 MB")
	 */
	getHumanReadableSize(): string {
		const bytes = Number(this.sizeBytes);
		if (bytes === 0) return "0 B";

		const units = ["B", "KB", "MB", "GB", "TB"];
		const k = 1024;
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		const size = bytes / k ** i;

		// 소수점 첫째 자리까지만 표시 (1 미만이면 정수로)
		return i === 0
			? `${bytes} ${units[i]}`
			: `${size.toFixed(size < 10 ? 1 : 0)} ${units[i]}`;
	}
}
