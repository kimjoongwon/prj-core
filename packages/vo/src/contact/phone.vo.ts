import type { PhoneNumber } from "libphonenumber-js";
import { parsePhoneNumber } from "libphonenumber-js";
import { ValueObject } from "../common/value-object.base";
import { VoValidationError } from "../errors/vo.error";

interface PhoneProps {
	value: string;
	normalized: string; // E.164 형식
}

/**
 * 전화번호 Value Object
 *
 * - 국제 전화번호 형식 검증 (libphonenumber-js)
 * - E.164 형식으로 정규화
 * - 불변성 보장
 */
export class Phone extends ValueObject<PhoneProps> {
	private phoneNumber!: PhoneNumber;

	protected validate(props: PhoneProps): void {
		const { value } = props;

		if (!value) {
			throw new VoValidationError("전화번호는 필수입니다.");
		}

		try {
			this.phoneNumber = parsePhoneNumber(value);

			if (!this.phoneNumber.isValid()) {
				throw new VoValidationError(`유효하지 않은 전화번호입니다: ${value}`);
			}
		} catch (error) {
			throw new VoValidationError(`전화번호 파싱 실패: ${value}`);
		}
	}

	/**
	 * 팩토리 메서드
	 */
	public static create(phone: string, defaultCountry = "KR"): Phone {
		try {
			const phoneNumber = parsePhoneNumber(phone, defaultCountry as any);

			if (!phoneNumber.isValid()) {
				throw new VoValidationError(`유효하지 않은 전화번호입니다: ${phone}`);
			}

			return new Phone({
				value: phone,
				normalized: phoneNumber.number,
			});
		} catch (error) {
			throw new VoValidationError(`전화번호 생성 실패: ${phone}`);
		}
	}

	/**
	 * 원본 값 반환
	 */
	public get value(): string {
		return this.props.value;
	}

	/**
	 * E.164 형식 반환
	 */
	public get normalized(): string {
		return this.props.normalized;
	}

	/**
	 * 국가 코드 반환
	 */
	public getCountryCode(): string | undefined {
		return this.phoneNumber.country;
	}

	/**
	 * 국가 번호 반환 (예: +82)
	 */
	public getCountryCallingCode(): string {
		return `+${this.phoneNumber.countryCallingCode}`;
	}

	/**
	 * 국내 형식 반환
	 */
	public formatNational(): string {
		return this.phoneNumber.formatNational();
	}

	/**
	 * 국제 형식 반환
	 */
	public formatInternational(): string {
		return this.phoneNumber.formatInternational();
	}

	/**
	 * 문자열 표현 (E.164 형식)
	 */
	public toString(): string {
		return this.props.normalized;
	}
}
