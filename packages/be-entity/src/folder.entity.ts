import {
	BigIntIdField,
	BigIntIdFieldOptional,
	ClassField,
	NumberField,
	StringField,
} from "@cocrepo/decorator/field";

import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { Asset } from "./asset.entity";
import type { Space } from "./space.entity";
import { User } from "./user.entity";

export class Folder extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	folderId!: string;

	// ============================================================================
	// 필수 필드
	// ============================================================================
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

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	space?: Space;
	@ClassField(() => Folder, { required: false, description: "부모 폴더" })
	parent?: Folder | null;
	@ClassField(() => Folder, {
		isArray: true,
		required: false,
		description: "하위 폴더 목록",
	})
	children?: Folder[];
	@ClassField(() => User, { required: false, nullable: true })
	createdBy?: User | null;
	@ClassField(() => Asset, { required: false, each: true }) assets?: Asset[];

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
