import type { PasswordHistory as PasswordHistoryEntity } from "@cocrepo/prisma";
import type { DomainEntityModel } from "./domain-entity-model.type";

export class PasswordHistory
	implements DomainEntityModel<PasswordHistoryEntity>
{
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
