import {
	BigIntIdField,
	BooleanField,
	DateField,
	DateFieldOptional,
	EnumField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { WhitelistType } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";

/**
 * 화이트리스트 항목 엔티티
 *
 * IP, 이메일 도메인, CORS Origin 화이트리스트를 관리합니다.
 */
export class WhitelistEntry extends AbstractEntity {
	@BigIntIdField({ description: "ID" })
	declare id: bigint;
	@DateField({ description: "생성일" })
	declare createdAt: Date;
	@DateFieldOptional({ nullable: true, description: "수정일" })
	declare updatedAt: Date | null;

	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	whitelistEntryId!: string;

	// ============================================================================
	// 기본 필드
	// ============================================================================
	@EnumField(() => WhitelistType, { description: "유형" })
	type!: WhitelistType;
	@StringField({ description: "값" })
	value!: string;
	@BooleanField({ description: "활성 여부" })
	isActive!: boolean;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	@StringFieldOptional({ nullable: true, description: "설명" })
	description!: string | null;

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
