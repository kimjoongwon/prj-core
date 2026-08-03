import type { JsonValue } from "@cocrepo/type";
import { AbstractEntity } from "./abstract.entity";

/**
 * OIDC 모델 엔티티
 */
export class OidcModel extends AbstractEntity {
	/** 공개 식별자 ULID */
	oidcModelId!: string;

	// ============================================================================
	// 필수 필드
	// ============================================================================
	key!: string;
	modelType!: string;
	payload!: JsonValue;
	expiresAt!: Date | null;
	userCode!: string | null;
	grantId!: string | null;
	uid!: string | null;

	// ============================================================================
	// 도메인 메서드
	// ============================================================================

	isExpired(): boolean {
		if (!this.expiresAt) return false;
		return this.expiresAt.getTime() < Date.now();
	}
}
