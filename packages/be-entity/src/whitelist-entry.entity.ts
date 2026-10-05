import {
	BigIntIdFieldMetadata,
	BooleanFieldMetadata,
	DateFieldMetadata,
	DateFieldOptionalMetadata,
	EnumFieldMetadata,
	StringFieldMetadata,
	StringFieldOptionalMetadata,
} from "@cocrepo/decorator/field";
import { WhitelistType } from "@cocrepo/enum";
import { WhitelistEntrySchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";

/**
 * 화이트리스트 항목 엔티티
 *
 * IP, 이메일 도메인, CORS Origin 화이트리스트를 관리합니다.
 */
@AbstractEntityFields()
export class WhitelistEntry extends WhitelistEntrySchema {
	@BigIntIdFieldMetadata({ description: "ID" })
	declare id: bigint;
	@DateFieldMetadata({ description: "생성일" })
	declare createdAt: Date;
	@DateFieldOptionalMetadata({ nullable: true, description: "수정일" })
	declare updatedAt: Date | null;

	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare whitelistEntryId: WhitelistEntrySchema["whitelistEntryId"];

	// ============================================================================
	// 기본 필드
	// ============================================================================
	@EnumFieldMetadata(() => WhitelistType, { description: "유형" })
	declare type: WhitelistEntrySchema["type"];
	@StringFieldMetadata({ description: "값" })
	declare value: WhitelistEntrySchema["value"];
	@BooleanFieldMetadata({ description: "활성 여부" })
	declare isActive: WhitelistEntrySchema["isActive"];

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	@StringFieldOptionalMetadata({ nullable: true, description: "설명" })
	declare description: WhitelistEntrySchema["description"];

	// ============================================================================
	// 도메인 메서드
	// ============================================================================

	/**
	 * IP 화이트리스트 항목인지 확인합니다
	 */
	isIpEntry(): boolean {
		return this.type === "IP";
	}

	/**
	 * 이메일 도메인 화이트리스트 항목인지 확인합니다
	 */
	isEmailDomainEntry(): boolean {
		return this.type === "EMAIL_DOMAIN";
	}

	/**
	 * CORS Origin 화이트리스트 항목인지 확인합니다
	 */
	isCorsOriginEntry(): boolean {
		return this.type === "CORS_ORIGIN";
	}
}
