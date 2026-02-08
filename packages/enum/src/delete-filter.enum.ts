/**
 * 소프트 삭제 필터
 * removedAt 필드 기반으로 레코드의 삭제 상태를 필터링합니다.
 */
export enum DeleteFilter {
	/** 활성 레코드만 (removedAt is null) */
	ACTIVE = "active",
	/** 삭제된 레코드만 (removedAt is not null) */
	DELETED = "deleted",
}
