import { AbstractEntity } from "./abstract.entity";

export class PasswordHistory extends AbstractEntity {
	/** 공개 식별자 ULID */
	passwordHistoryId!: string;

	// ============================================================================
	// 필수 필드
	// ============================================================================
	userId!: bigint;
	passwordHash!: string;
}
