import { ValueObject } from "../common/value-object.base";
import { VoValidationError } from "../errors/vo.error";
import type { CurrencyCodeProps } from "./currency-code.props";

export class CurrencyCode extends ValueObject<CurrencyCodeProps> {
	private static readonly ISO_4217_REGEX = /^[A-Z]{3}$/;

	protected validate(props: CurrencyCodeProps): void {
		if (!props.value) {
			throw new VoValidationError("통화 코드는 필수입니다.");
		}

		if (!CurrencyCode.ISO_4217_REGEX.test(props.value)) {
			throw new VoValidationError(
				"통화 코드는 ISO 4217 3자리 코드여야 합니다.",
			);
		}
	}

	public static create(currency: string): CurrencyCode {
		return new CurrencyCode({ value: currency.trim().toUpperCase() });
	}

	public get value(): string {
		return this.props.value;
	}

	public toString(): string {
		return this.props.value;
	}
}
