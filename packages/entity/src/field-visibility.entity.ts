import type {
	FieldVisibility as FieldVisibilityEntity,
	FieldVisibilityType,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Category } from "./category.entity";
import type { Group } from "./group.entity";
import type { MaskingPattern } from "./masking-pattern.entity";

export class FieldVisibility
	extends AbstractEntity
	implements FieldVisibilityEntity
{
	// 대상 정의
	subject!: string;
	field!: string;

	// 권한 기준
	roleCategoryId!: string;
	roleGroupId!: string | null;

	// 가시성 설정
	visibility!: FieldVisibilityType;
	maskingPatternId!: string | null;

	// 관계
	roleCategory?: Category;
	roleGroup?: Group | null;
	maskingPattern?: MaskingPattern | null;

	/**
	 * 전체 공개 상태인지 확인
	 */
	isFull(): boolean {
		return this.visibility === "FULL";
	}

	/**
	 * 마스킹 상태인지 확인
	 */
	isMasked(): boolean {
		return this.visibility === "MASKED";
	}

	/**
	 * 숨김 상태인지 확인
	 */
	isHidden(): boolean {
		return this.visibility === "HIDDEN";
	}

	/**
	 * 필드 키를 반환합니다 (subject.field 형식)
	 */
	getFieldKey(): string {
		return `${this.subject}.${this.field}`;
	}

	/**
	 * 값에 가시성 규칙을 적용합니다
	 * @param value 원본 값
	 * @returns 가시성이 적용된 값
	 */
	applyVisibility(value: string): string | null {
		switch (this.visibility) {
			case "FULL":
				return value;
			case "HIDDEN":
				return null;
			case "MASKED":
				if (this.maskingPattern) {
					return this.maskingPattern.applyMask(value);
				}
				// 마스킹 패턴이 없으면 기본 마스킹
				return "***";
			default:
				return value;
		}
	}
}
