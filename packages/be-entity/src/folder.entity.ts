import { AbstractEntity } from "./abstract.entity";
import type { Asset } from "./asset.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

export class Folder extends AbstractEntity {
	/** 공개 식별자 ULID */
	folderId!: string;

	// ============================================================================
	// 필수 필드
	// ============================================================================
	spaceId!: bigint;
	parentFolderId!: bigint | null;
	name!: string;
	path!: string;
	sortOrder!: number;
	createdById!: bigint | null;

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	space?: Space;
	parent?: Folder | null;
	children?: Folder[];
	createdBy?: User | null;
	assets?: Asset[];

	// ============================================================================
	// 도메인 메서드
	// ============================================================================

	/**
	 * 루트 폴더인지 확인합니다
	 */
	isRoot(): boolean {
		return this.parentFolderId === null;
	}

	/**
	 * 폴더 깊이를 계산합니다 (path 기준)
	 */
	getDepth(): number {
		if (this.path === "/") return 0;
		return this.path.split("/").filter(Boolean).length;
	}

	/**
	 * 특정 폴더의 하위 폴더인지 확인합니다
	 */
	isDescendantOf(folderId: bigint): boolean {
		if (!this.parentFolderId) return false;
		if (this.parentFolderId === folderId) return true;
		// parent가 로드되어 있으면 재귀적으로 확인
		if (this.parent) {
			return this.parent.isDescendantOf(folderId);
		}
		// parent가 로드되지 않은 경우 path 기반으로 확인
		return false;
	}
}
