import {
	BigIntIdField,
	BigIntIdFieldOptional,
	ClassField,
	EnumField,
	NumberField,
	NumberFieldOptional,
	StringField,
} from "@cocrepo/decorator/field";

import { DerivativeKind } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { Asset } from "./asset.entity";
import type { Space } from "./space.entity";
import { User } from "./user.entity";

export class Derivative extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	derivativeId!: string;

	// ============================================================================
	// 필수 필드
	// ============================================================================
	@BigIntIdField({ description: "소속 Space ID" })
	spaceId!: bigint;
	@BigIntIdFieldOptional({ nullable: true, description: "생성자 ID" })
	createdById!: bigint | null;
	@BigIntIdField({ description: "원본 에셋 ID" })
	assetId!: bigint;
	@EnumField(() => DerivativeKind, {
		description: "파생 리소스 종류 (THUMBNAIL, PREVIEW, TRANSCODE, TEXT)",
	})
	kind!: DerivativeKind;
	@StringField({ description: "프로필명 (예: thumbnail-256, preview-1080p)" })
	profile!: string;
	@StringField({ description: "스토리지 저장 키" })
	storageKey!: string;
	@StringField({ description: "MIME 타입" })
	mimeType!: string;
	@NumberField({ description: "파일 크기 (바이트)", int: true })
	sizeBytes!: bigint;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	@NumberFieldOptional({
		nullable: true,
		description: "너비 (이미지/비디오)",
		int: true,
	})
	width!: number | null;
	@NumberFieldOptional({
		nullable: true,
		description: "높이 (이미지/비디오)",
		int: true,
	})
	height!: number | null;
	@NumberFieldOptional({
		nullable: true,
		description: "재생 시간 (밀리초, 비디오)",
		int: true,
	})
	durationMs!: number | null;

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	space?: Space;
	@ClassField(() => User, { required: false, nullable: true })
	createdBy?: User | null;
	@ClassField(() => Asset, {
		required: false,
		description: "원본 에셋",
	})
	asset?: Asset;

	// ============================================================================
	// 도메인 메서드
	// ============================================================================

	/**
	 * 썸네일인지 확인합니다
	 */
	isThumbnail(): boolean {
		return this.kind === "THUMBNAIL";
	}

	/**
	 * 프리뷰인지 확인합니다
	 */
	isPreview(): boolean {
		return this.kind === "PREVIEW";
	}

	/**
	 * 트랜스코딩된 비디오인지 확인합니다
	 */
	isTranscode(): boolean {
		return this.kind === "TRANSCODE";
	}

	/**
	 * 추출된 텍스트인지 확인합니다
	 */
	isText(): boolean {
		return this.kind === "TEXT";
	}

	/**
	 * 사람이 읽기 쉬운 크기를 반환합니다
	 */
	getHumanReadableSize(): string {
		const bytes = Number(this.sizeBytes);
		if (bytes === 0) return "0 B";

		const units = ["B", "KB", "MB", "GB", "TB"];
		const k = 1024;
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		const size = bytes / k ** i;

		return i === 0
			? `${bytes} ${units[i]}`
			: `${size.toFixed(size < 10 ? 1 : 0)} ${units[i]}`;
	}

	/**
	 * 해상도 문자열을 반환합니다 (이미지/비디오인 경우)
	 */
	getResolution(): string | null {
		if (this.width !== null && this.height !== null) {
			return `${this.width}x${this.height}`;
		}
		return null;
	}
}
