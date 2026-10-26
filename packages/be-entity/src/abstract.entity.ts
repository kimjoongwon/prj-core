import type { BaseEntityFields } from "@cocrepo/type";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";

/**
 * 모든 엔티티의 기본 클래스
 * DTO 변환 기능을 제공합니다
 *
 * @template DTO - 변환할 DTO 타입
 * @template O - toDto 옵션 타입
 */
@AbstractEntityFields()
export class AbstractEntity implements BaseEntityFields {
	id!: bigint;

	createdAt!: Date;

	updatedAt!: Date | null;

	removedAt!: Date | null;
}
