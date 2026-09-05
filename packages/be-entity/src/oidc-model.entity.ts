import type { JsonValue } from "@cocrepo/type";
import { DateFieldOptional, StringField, StringFieldOptional } from "@cocrepo/decorator/field";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";

/**
 * OIDC 모델 엔티티
 */
export class OidcModel extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	oidcModelId!: string;

	// ============================================================================
	// 필수 필드
	// ============================================================================
	@StringField({ description: "모델 키" })
	key!: string;
	@StringField({ description: "모델 유형" })
	modelType!: string;
	payload!: JsonValue;
	@DateFieldOptional({ nullable: true, description: "만료 시각" })
	expiresAt!: Date | null;
	@StringFieldOptional({ nullable: true, description: "사용자 코드" })
	userCode!: string | null;
	@StringFieldOptional({ nullable: true, description: "Grant ID" })
	grantId!: string | null;
	@StringFieldOptional({ nullable: true, description: "UID" })
	uid!: string | null;

	// ============================================================================
	// 도메인 메서드
	// ============================================================================

	isExpired(): boolean {
		if (!this.expiresAt) return false;
		return this.expiresAt.getTime() < Date.now();
	}
}
