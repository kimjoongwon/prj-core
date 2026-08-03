import type { WhitelistType } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";

/**
 * 화이트리스트 항목 엔티티
 *
 * IP, 이메일 도메인, CORS Origin 화이트리스트를 관리합니다.
 */
export class WhitelistEntry extends AbstractEntity {
	/** 공개 식별자 ULID */
	whitelistEntryId!: string;

	// ============================================================================
	// 기본 필드
	// ============================================================================
	type!: WhitelistType;
	value!: string;
	isActive!: boolean;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
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
