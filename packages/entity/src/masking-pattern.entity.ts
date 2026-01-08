import type {
	MaskingFieldType,
	MaskingPattern as MaskingPatternEntity,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { FieldVisibility } from "./field-visibility.entity";

export class MaskingPattern
	extends AbstractEntity
	implements MaskingPatternEntity
{
	name!: string;
	fieldType!: MaskingFieldType;
	pattern!: string;
	example!: string | null;
	description!: string | null;

	// 관계
	fieldVisibilities?: FieldVisibility[];

	/**
	 * 값에 마스킹 패턴을 적용합니다
	 * @param value 마스킹할 원본 값
	 * @returns 마스킹된 값
	 */
	applyMask(value: string): string {
		if (!value) return value;

		// 프리셋 패턴 처리
		if (this.pattern.startsWith("PRESET_")) {
			return this.applyPresetMask(value);
		}

		// 커스텀 정규식 패턴 처리
		try {
			const regex = new RegExp(this.pattern, "g");
			return value.replace(regex, "*");
		} catch {
			return value;
		}
	}

	private applyPresetMask(value: string): string {
		switch (this.pattern) {
			case "PRESET_EMAIL":
				// user@domain.com → u***@domain.com
				return value.replace(/^(.)[^@]*(@.*)$/, "$1***$2");
			case "PRESET_PHONE":
				// 010-1234-5678 → 010-****-5678
				return value.replace(/^(\d{3})-?(\d{4})-?(\d{4})$/, "$1-****-$3");
			case "PRESET_NAME":
				// 홍길동 → 홍*동
				if (value.length <= 2) return value[0] + "*";
				return value[0] + "*".repeat(value.length - 2) + value.slice(-1);
			case "PRESET_SSN":
				// 주민번호 뒷자리 마스킹
				return value.replace(/^(\d{6})-?(\d{7})$/, "$1-*******");
			case "PRESET_CARD":
				// 1234-5678-9012-3456 → 1234-****-****-3456
				return value.replace(
					/^(\d{4})-?(\d{4})-?(\d{4})-?(\d{4})$/,
					"$1-****-****-$4",
				);
			case "PRESET_ACCOUNT": {
				// 계좌번호 중간 마스킹
				if (value.length <= 6) return value;
				const start = value.slice(0, 3);
				const end = value.slice(-3);
				return start + "*".repeat(value.length - 6) + end;
			}
			default:
				return value;
		}
	}
}
