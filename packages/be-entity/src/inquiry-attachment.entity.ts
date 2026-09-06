import {
	BigIntIdField,
	BooleanField,
	EnumField,
	NumberField,
	StringField,
} from "@cocrepo/decorator/field";

import { AttachmentFileType } from "@cocrepo/enum";

import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import type { InquiryMessage } from "./inquiry-message.entity";

/**
 * 문의 메시지에 첨부된 파일을 관리하는 엔티티
 *
 * 이미지, 문서, 동영상 등 다양한 파일 형식을 지원하며,
 * 실시간 채팅에서 파일 업로드/다운로드를 처리합니다.
 */
export class InquiryAttachment extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	inquiryAttachmentId!: string;

	// ============================================================================
	// 필수 필드
	// ============================================================================
	@BigIntIdField({ description: "소속 메시지 ID" })
	messageId!: bigint;
	@StringField({ description: "원본 파일명" })
	fileName!: string;
	@NumberField({ description: "파일 크기" })
	fileSize!: bigint;
	@StringField({ description: "MIME 타입" })
	mimeType!: string;
	@EnumField(() => AttachmentFileType, { description: "파일 유형" })
	fileType!: AttachmentFileType;
	@StringField({ description: "파일 URL" })
	url!: string;
	@BooleanField({ description: "삭제 여부" })
	isDeleted!: boolean;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	@StringField({ nullable: true, description: "썸네일 URL" })
	thumbnailUrl!: string | null;
	@NumberField({ nullable: true, description: "이미지 너비" })
	width!: number | null;
	@NumberField({ nullable: true, description: "이미지 높이" })
	height!: number | null;
	@NumberField({ nullable: true, description: "재생 시간 (초)" })
	duration!: number | null;

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	message?: InquiryMessage;

	// ============================================================================
	// 파일 유형 확인 메서드
	// ============================================================================

	/**
	 * 이미지 여부
	 */
	isImage(): boolean {
		return this.fileType === "IMAGE";
	}

	/**
	 * 동영상 여부
	 */
	isVideo(): boolean {
		return this.fileType === "VIDEO";
	}

	/**
	 * 오디오 여부
	 */
	isAudio(): boolean {
		return this.fileType === "AUDIO";
	}

	/**
	 * 문서 여부
	 */
	isDocument(): boolean {
		return this.fileType === "DOCUMENT";
	}

	/**
	 * 썸네일 존재 여부
	 */
	hasThumbnail(): boolean {
		return this.thumbnailUrl !== null;
	}

	/**
	 * 파일 확장자 추출
	 */
	getFileExtension(): string {
		const parts = this.fileName.split(".");
		if (parts.length > 1) {
			return parts.pop()?.toLowerCase() || "";
		}
		return "";
	}

	/**
	 * 파일 크기 포맷팅 (KB, MB)
	 */
	getFormattedSize(): string {
		const bytes = Number(this.fileSize);

		if (bytes === 0) return "0 B";

		const units = ["B", "KB", "MB", "GB"];
		const k = 1024;
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		const size = bytes / k ** i;

		return `${size.toFixed(1)} ${units[i]}`;
	}

	/**
	 * 소프트 삭제
	 */
	softDelete(): void {
		this.isDeleted = true;
	}
}
