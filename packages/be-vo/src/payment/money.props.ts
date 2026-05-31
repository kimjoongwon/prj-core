import type { CurrencyCode } from "./currency-code.vo";

export interface MoneyProps {
	amount: number;
	currency: CurrencyCode;
}
