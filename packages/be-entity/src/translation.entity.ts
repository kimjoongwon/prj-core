import type { LanguageCode } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";

export class Translation extends AbstractEntity {
	// ============================================================================
	// 필수 필드
	// ============================================================================
	languageCode!: LanguageCode;
	key!: string;
	text!: string;
	category!: string;
	isTranslated!: boolean;

	// ============================================================================
	// 도메인 메서드
	// ============================================================================

	/**
	 * 번역이 완료되었는지 확인합니다
	 */
	isCompleted(): boolean {
		return this.isTranslated;
	}

	/**
	 * 번역 키가 특정 카테고리에 속하는지 확인합니다
	 */
	belongsToCategory(category: string): boolean {
		return this.category === category;
	}

	/**
	 * 특정 언어 코드인지 확인합니다
	 */
	isLanguage(languageCode: LanguageCode): boolean {
		return this.languageCode === languageCode;
	}

	/**
	 * 번역 키의 prefix를 반환합니다 (예: "menu:users:list" → "menu")
	 */
	getKeyPrefix(): string {
		return this.key.split(":")[0] || "";
	}

	/**
	 * 번역 키의 depth를 반환합니다 (콜론 개수 + 1)
	 * 예: "menu:users:list" → 3
	 */
	getKeyDepth(): number {
		return this.key.split(":").length;
	}
}
