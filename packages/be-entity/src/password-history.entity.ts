import type { PasswordHistory as PasswordHistoryEntity } from "@cocrepo/prisma";

export class PasswordHistory implements PasswordHistoryEntity {
	// ============================================================================
	// 기본 필드
	// ============================================================================
	id!: string;
	createdAt!: Date;

	// ============================================================================
	// 필수 필드
	// ============================================================================
	userId!: string;
	passwordHash!: string;
}
