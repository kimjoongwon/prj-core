import type { ActionConfig, ActionMaskingConfig } from "@cocrepo/type";
import { Injectable, Logger } from "@nestjs/common";

/**
 * 마스킹 프리셋 상수
 *
 * Action.config에서 사용되는 마스킹 프리셋 이름
 */
export const MASKING_PRESETS = {
	EMAIL: "PRESET_EMAIL",
	PHONE: "PRESET_PHONE",
	NAME: "PRESET_NAME",
	SSN: "PRESET_SSN",
	CARD: "PRESET_CARD",
	ACCOUNT: "PRESET_ACCOUNT",
} as const;

export type MaskingPreset =
	(typeof MASKING_PRESETS)[keyof typeof MASKING_PRESETS];

/**
 * 마스킹 서비스
 *
 * @description
 * Action.config의 마스킹 설정을 실제 데이터에 적용합니다.
 * 개인정보 보호를 위한 다양한 마스킹 프리셋과 커스텀 패턴을 지원합니다.
 *
 * @example
 * // 프리셋 사용
 * const config = { type: "masking", preset: "PRESET_EMAIL" };
 * maskingService.applyMasking("minsu.kim92@gmail.com", config);
 * // 결과: "min***@gmail.com"
 *
 * // 커스텀 패턴 사용
 * const config = { type: "masking", pattern: "^(.{3}).*(.{2})$", replacement: "$1***$2" };
 * maskingService.applyMasking("홍길동입니다", config);
 * // 결과: "홍길동***다"
 */
@Injectable()
export class MaskingService {
	private readonly logger = new Logger(MaskingService.name);

	/**
	 * Action config를 사용해 값 마스킹
	 *
	 * @param value - 마스킹할 원본 값
	 * @param config - Action 설정 (masking 타입이어야 함)
	 * @returns 마스킹된 값 또는 원본 값
	 */
	applyMasking(value: string, config: ActionConfig): string {
		// null/undefined/빈 문자열 처리
		if (value == null || value === "") {
			return "";
		}

		// 마스킹 설정이 아니면 원본 반환
		if (!config || config.type !== "masking") {
			return value;
		}

		const maskingConfig = config as ActionMaskingConfig;

		// 프리셋 마스킹
		if (maskingConfig.preset) {
			return this.applyPreset(value, maskingConfig.preset);
		}

		// 커스텀 패턴 마스킹
		if (maskingConfig.pattern && maskingConfig.replacement) {
			return this.applyCustomPattern(
				value,
				maskingConfig.pattern,
				maskingConfig.replacement,
			);
		}

		// 설정이 불완전하면 원본 반환
		this.logger.warn(
			"마스킹 설정이 불완전합니다. preset 또는 pattern/replacement가 필요합니다.",
		);
		return value;
	}

	/**
	 * 프리셋 기반 마스킹
	 *
	 * @param value - 마스킹할 원본 값
	 * @param preset - 마스킹 프리셋 이름
	 * @returns 마스킹된 값
	 */
	private applyPreset(value: string, preset: string): string {
		switch (preset) {
			case MASKING_PRESETS.EMAIL:
				return this.maskEmail(value);
			case MASKING_PRESETS.PHONE:
				return this.maskPhone(value);
			case MASKING_PRESETS.NAME:
				return this.maskName(value);
			case MASKING_PRESETS.SSN:
				return this.maskSsn(value);
			case MASKING_PRESETS.CARD:
				return this.maskCard(value);
			case MASKING_PRESETS.ACCOUNT:
				return this.maskAccount(value);
			default:
				this.logger.warn(`알 수 없는 마스킹 프리셋: ${preset}`);
				return value;
		}
	}

	/**
	 * 커스텀 패턴 기반 마스킹
	 *
	 * @param value - 마스킹할 원본 값
	 * @param pattern - 정규식 패턴 문자열
	 * @param replacement - 치환 문자열 ($1, $2 등 캡처 그룹 사용 가능)
	 * @returns 마스킹된 값
	 */
	private applyCustomPattern(
		value: string,
		pattern: string,
		replacement: string,
	): string {
		try {
			const regex = new RegExp(pattern);
			return value.replace(regex, replacement);
		} catch (error) {
			this.logger.error(`정규식 패턴 오류: ${pattern}`, error);
			return value;
		}
	}

	/**
	 * 객체의 특정 필드들을 마스킹
	 *
	 * @description
	 * 주어진 객체의 필드들을 각각의 마스킹 설정에 따라 마스킹합니다.
	 * 원본 객체를 수정하지 않고 새로운 객체를 반환합니다.
	 *
	 * @param data - 마스킹할 데이터 객체
	 * @param fieldsToMask - 필드명과 해당 마스킹 설정의 Map
	 * @returns 마스킹이 적용된 새 객체
	 *
	 * @example
	 * const user = { name: "김민수", email: "minsu.kim92@gmail.com", age: 30 };
	 * const fieldsToMask = new Map([
	 *   ["name", { type: "masking", preset: "PRESET_NAME" }],
	 *   ["email", { type: "masking", preset: "PRESET_EMAIL" }],
	 * ]);
	 * const masked = maskingService.maskFields(user, fieldsToMask);
	 * // 결과: { name: "김*수", email: "min***@gmail.com", age: 30 }
	 */
	maskFields<T extends object>(
		data: T,
		fieldsToMask: Map<string, ActionConfig>,
	): T {
		if (!data || typeof data !== "object") {
			return data;
		}

		// 새 객체 생성 (원본 보존)
		const result = { ...data } as Record<string, unknown>;

		fieldsToMask.forEach((config, fieldName) => {
			if (fieldName in result) {
				const originalValue = result[fieldName];

				// 문자열인 경우만 마스킹 적용
				if (typeof originalValue === "string") {
					result[fieldName] = this.applyMasking(originalValue, config);
				}
			}
		});

		return result as T;
	}

	/**
	 * 배열의 각 객체에 마스킹 적용
	 *
	 * @param dataArray - 마스킹할 데이터 배열
	 * @param fieldsToMask - 필드명과 해당 마스킹 설정의 Map
	 * @returns 마스킹이 적용된 새 배열
	 */
	maskFieldsArray<T extends object>(
		dataArray: T[],
		fieldsToMask: Map<string, ActionConfig>,
	): T[] {
		if (!Array.isArray(dataArray)) {
			return dataArray;
		}

		return dataArray.map((item) => this.maskFields(item, fieldsToMask));
	}

	/**
	 * 이메일 마스킹
	 *
	 * @example
	 * "minsu.kim92@gmail.com" → "min***@gmail.com"
	 */
	private maskEmail(email: string): string {
		const atIndex = email.indexOf("@");
		if (atIndex === -1) {
			// '@'가 없으면 처음 3자 남기고 마스킹
			return email.length > 3 ? `${email.slice(0, 3)}***` : email;
		}

		const localPart = email.slice(0, atIndex);
		const domainPart = email.slice(atIndex);

		// 로컬 파트의 처음 3자만 표시, 나머지는 마스킹
		const visibleLength = Math.min(3, localPart.length);
		const maskedLocal = `${localPart.slice(0, visibleLength)}***`;

		return `${maskedLocal}${domainPart}`;
	}

	/**
	 * 전화번호 마스킹
	 *
	 * @example
	 * "010-5678-9012" → "010-****-9012"
	 */
	private maskPhone(phone: string): string {
		// 하이픈 포함 형식 (010-1234-5678)
		const hyphenMatch = phone.match(/^(\d{2,3})-(\d{3,4})-(\d{4})$/);
		if (hyphenMatch) {
			return `${hyphenMatch[1]}-****-${hyphenMatch[3]}`;
		}

		// 숫자만 있는 형식 (01012345678)
		const numberMatch = phone.match(/^(\d{2,3})(\d{3,4})(\d{4})$/);
		if (numberMatch) {
			return `${numberMatch[1]}****${numberMatch[3]}`;
		}

		// 패턴 매칭 실패 시 가운데 부분 마스킹
		if (phone.length >= 7) {
			const start = phone.slice(0, 3);
			const end = phone.slice(-4);
			return `${start}****${end}`;
		}

		return phone;
	}

	/**
	 * 이름 마스킹
	 *
	 * @example
	 * "김민수" → "김*수"
	 * "홍길동" → "홍*동"
	 * "아이유" → "아*유"
	 */
	private maskName(name: string): string {
		if (name.length <= 1) {
			return name;
		}

		if (name.length === 2) {
			return `${name[0]}*`;
		}

		// 첫 글자와 마지막 글자 유지, 가운데 마스킹
		const first = name[0];
		const last = name[name.length - 1];
		const middleMask = "*".repeat(name.length - 2);

		return `${first}${middleMask}${last}`;
	}

	/**
	 * 주민등록번호 마스킹
	 *
	 * @example
	 * "920315-1234567" → "920315-*******"
	 */
	private maskSsn(ssn: string): string {
		// 하이픈 포함 형식 (920315-1234567)
		const hyphenMatch = ssn.match(/^(\d{6})-?(\d{7})$/);
		if (hyphenMatch) {
			return `${hyphenMatch[1]}-*******`;
		}

		// 숫자만 있는 형식 (9203151234567)
		if (/^\d{13}$/.test(ssn)) {
			return `${ssn.slice(0, 6)}-*******`;
		}

		// 패턴 매칭 실패 시 뒷부분 마스킹
		if (ssn.length > 6) {
			return `${ssn.slice(0, 6)}-*******`;
		}

		return ssn;
	}

	/**
	 * 카드번호 마스킹
	 *
	 * @example
	 * "1234-5678-9012-3456" → "1234-****-****-3456"
	 */
	private maskCard(card: string): string {
		// 하이픈 포함 형식 (1234-5678-9012-3456)
		const hyphenMatch = card.match(/^(\d{4})-(\d{4})-(\d{4})-(\d{4})$/);
		if (hyphenMatch) {
			return `${hyphenMatch[1]}-****-****-${hyphenMatch[4]}`;
		}

		// 숫자만 있는 형식 (1234567890123456)
		const numberMatch = card.match(/^(\d{4})(\d{4})(\d{4})(\d{4})$/);
		if (numberMatch) {
			return `${numberMatch[1]}********${numberMatch[4]}`;
		}

		// 패턴 매칭 실패 시 가운데 마스킹
		if (card.length >= 12) {
			const start = card.slice(0, 4);
			const end = card.slice(-4);
			return `${start}-****-****-${end}`;
		}

		return card;
	}

	/**
	 * 계좌번호 마스킹
	 *
	 * @example
	 * "110-123-456789" → "110-***-******"
	 */
	private maskAccount(account: string): string {
		// 하이픈 포함 형식
		const parts = account.split("-");
		if (parts.length >= 2) {
			const first = parts[0];
			const maskedParts = parts.slice(1).map((part) => "*".repeat(part.length));
			return `${first}-${maskedParts.join("-")}`;
		}

		// 하이픈 없는 경우 앞 3자리 남기고 마스킹
		if (account.length > 3) {
			return `${account.slice(0, 3)}${"*".repeat(account.length - 3)}`;
		}

		return account;
	}
}
