import { BooleanField, EnumField, StringField } from "@cocrepo/decorator/field";
import { LanguageCode } from "@cocrepo/prisma";
import { ApiProperty } from "@nestjs/swagger";
import { AbstractEntity } from "./abstract.entity";

export class Translation extends AbstractEntity {
	@ApiProperty({
		description: "수정일시",
		type: Date,
		nullable: true,
	})
	declare updatedAt: Date | null;
	@ApiProperty({
		description: "생성일시",
		type: Date,
	})
	declare createdAt: Date;
	// ============================================================================
	// 필수 필드
	// ============================================================================
	@EnumField(() => LanguageCode, { swagger: false })
	@ApiProperty({
		description: "언어 코드",
		enum: LanguageCode,
		example: "ko_KR",
	})
	languageCode!: LanguageCode;
	@StringField({ swagger: false })
	@ApiProperty({
		description: "번역 키",
		example: "성공",
	})
	key!: string;
	@StringField({ swagger: false })
	@ApiProperty({
		description: "번역된 텍스트",
		example: "성공",
	})
	text!: string;
	@StringField({ swagger: false })
	@ApiProperty({
		description: "카테고리",
		example: "공통",
	})
	category!: string;
	@BooleanField({ swagger: false })
	@ApiProperty({
		description: "번역 완료 여부",
		example: true,
	})
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
