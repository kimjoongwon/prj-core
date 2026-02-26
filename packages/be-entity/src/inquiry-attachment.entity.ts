import type {
	InquiryAttachment as InquiryAttachmentEntity,
	AttachmentFileType,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { InquiryMessage } from "./inquiry-message.entity";

/**
 * 문의 메시지에 첨부된 파일을 관리하는 엔티티
 *
 * 이미지, 문서, 동영상 등 다양한 파일 형식을 지원하며,
 * 실시간 채팅에서 파일 업로드/다운로드를 처리합니다.
 */
export class InquiryAttachment extends AbstractEntity implements InquiryAttachmentEntity {
	// ============================================================================
	// 필수 필드
	// ============================================================================
	messageId!: string;
	fileName!: string;
	fileSize!: bigint;
	mimeType!: string;
	fileType!: AttachmentFileType;
	url!: string;
	isDeleted!: boolean;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	thumbnailUrl!: string | null;
	width!: number | null;
	height!: number | null;
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
		const size = bytes / Math.pow(k, i);

		return `${size.toFixed(1)} ${units[i]}`;
	}

	/**
	 * 소프트 삭제
	 */
	softDelete(): void {
		this.isDeleted = true;
	}
}
