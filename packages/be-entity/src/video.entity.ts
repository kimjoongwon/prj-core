import { AbstractEntity } from "./abstract.entity";
import type { Asset } from "./asset.entity";

export class Video extends AbstractEntity {
	/** 공개 식별자 ULID */
	videoId!: string;

	// ============================================================================
	// 필수 필드
	// ============================================================================
	width!: number;
	height!: number;
	durationMs!: number;
	hasAudio!: boolean;
	assetId!: bigint;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	frameRate!: number | null;
	codec!: string | null;
	bitrate!: number | null;

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	asset?: Asset;

	// ============================================================================
	// 도메인 메서드
	// ============================================================================

	/**
	 * 포맷된 재생 시간을 반환합니다 (예: "02:30" 또는 "01:02:00")
	 */
	getDurationFormatted(): string {
		const totalSeconds = Math.floor(this.durationMs / 1000);
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		if (hours > 0) {
			return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
		}

		return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	}

	/**
	 * 재생 시간을 초 단위로 반환합니다
	 */
	getDurationSeconds(): number {
		return Math.floor(this.durationMs / 1000);
	}

	/**
	 * 해상도 문자열을 반환합니다 (예: "1920x1080")
	 */
	getResolution(): string {
		return `${this.width}x${this.height}`;
	}

	/**
	 * 가로세로 비율을 반환합니다
	 */
	getAspectRatio(): number {
		if (this.height === 0) return 0;
		return this.width / this.height;
	}

	/**
	 * HD(720p) 이상인지 확인합니다
	 */
	isHD(): boolean {
		return this.height >= 720;
	}

	/**
	 * Full HD(1080p)인지 확인합니다
	 */
	isFullHD(): boolean {
		return this.height >= 1080;
	}

	/**
	 * 4K인지 확인합니다
	 */
	is4K(): boolean {
		return this.height >= 2160;
	}
}
