import type {
	Asset as AssetEntity,
	AssetKind,
	AssetStatus,
	Prisma,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Album } from "./album.entity";
import type { AlbumEntry } from "./album-entry.entity";
import type { Derivative } from "./derivative.entity";
import type { Document } from "./document.entity";
import type { Folder } from "./folder.entity";
import type { Image } from "./image.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";
import type { Video } from "./video.entity";

export class Asset extends AbstractEntity implements AssetEntity {
	// ============================================================================
	// 필수 필드
	// ============================================================================
	spaceId!: string;
	folderId!: string;
	kind!: AssetKind;
	status!: AssetStatus;
	originalName!: string;
	storageKey!: string;
	mimeType!: string;
	sizeBytes!: bigint; // BigInt 타입

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	extension!: string | null;
	checksum!: string | null;
	metadata!: Prisma.JsonValue | null;
	createdById!: string | null;

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	space?: Space;
	folder?: Folder;
	createdBy?: User | null;
	image?: Image | null;
	video?: Video | null;
	document?: Document | null;
	derivatives?: Derivative[];
	albumEntries?: AlbumEntry[];
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
