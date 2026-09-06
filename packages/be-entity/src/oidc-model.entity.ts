import {
	DateFieldOptionalMetadata,
	StringFieldMetadata,
	StringFieldOptionalMetadata,
} from "@cocrepo/decorator/field";
import { OidcModelSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";

/**
 * OIDC 모델 엔티티
 */
@AbstractEntityFields()
export class OidcModel extends OidcModelSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare oidcModelId: OidcModelSchema["oidcModelId"];

	// ============================================================================
	// 필수 필드
	// ============================================================================
	@StringFieldMetadata({ description: "모델 키" })
	declare key: OidcModelSchema["key"];
	@StringFieldMetadata({ description: "모델 유형" })
	declare modelType: OidcModelSchema["modelType"];
	declare payload: OidcModelSchema["payload"];
	@DateFieldOptionalMetadata({ nullable: true, description: "만료 시각" })
	declare expiresAt: OidcModelSchema["expiresAt"];
	@StringFieldOptionalMetadata({ nullable: true, description: "사용자 코드" })
	declare userCode: OidcModelSchema["userCode"];
	@StringFieldOptionalMetadata({ nullable: true, description: "Grant ID" })
	declare grantId: OidcModelSchema["grantId"];
	@StringFieldOptionalMetadata({ nullable: true, description: "UID" })
	declare uid: OidcModelSchema["uid"];

	// ============================================================================
	// 도메인 메서드
	// ============================================================================

	isExpired(): boolean {
		if (!this.expiresAt) return false;
		return this.expiresAt.getTime() < Date.now();
	}
}
