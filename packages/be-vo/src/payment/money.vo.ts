import { ValueObject } from "../common/value-object.base";
import { VoValidationError } from "../errors/vo.error";
import { CurrencyCode } from "./currency-code.vo";
import type { MoneyProps } from "./money.props";

export class Money extends ValueObject<MoneyProps> {
	protected validate(props: MoneyProps): void {
		if (!Number.isFinite(props.amount) || !Number.isInteger(props.amount)) {
			throw new VoValidationError("금액은 정수여야 합니다.");
		}

		if (props.amount < 0) {
			throw new VoValidationError("금액은 0 이상이어야 합니다.");
		}

		if (!(props.currency instanceof CurrencyCode)) {
			throw new VoValidationError("통화 코드는 CurrencyCode여야 합니다.");
		}
	}

	public static of(amount: number, currency: CurrencyCode | string): Money {
		const currencyCode =
			currency instanceof CurrencyCode
				? currency
				: CurrencyCode.create(currency);
		return new Money({ amount, currency: currencyCode });
	}

	public static zero(currency: CurrencyCode | string): Money {
		return Money.of(0, currency);
	}

	public add(other: Money): Money {
		this.assertSameCurrency(other);
		return Money.of(this.amount + other.amount, this.currency);
	}

	public multiply(quantity: number): Money {
		if (!Number.isInteger(quantity) || quantity < 1) {
			throw new VoValidationError("수량은 1 이상의 정수여야 합니다.");
		}

		return Money.of(this.amount * quantity, this.currency);
	}

	public get amount(): number {
		return this.props.amount;
	}

	public get currency(): CurrencyCode {
		return this.props.currency;
	}

	public get currencyValue(): string {
		return this.props.currency.value;
	}

	public isSameAmount(other: Money): boolean {
		return this.amount === other.amount && this.currency.equals(other.currency);
	}

	public toString(): string {
		return `${this.props.currency.value} ${this.props.amount}`;
	}

	private assertSameCurrency(other: Money): void {
		if (!this.currency.equals(other.currency)) {
			throw new VoValidationError(
				"서로 다른 통화의 금액은 합산할 수 없습니다.",
			);
		}
	}
}
