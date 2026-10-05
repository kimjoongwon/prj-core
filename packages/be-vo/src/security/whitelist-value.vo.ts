import { ValueObject } from "../common/value-object.base";
import { VoValidationError } from "../errors/vo.error";
import { CorsOrigin } from "./cors-origin.vo";
import { EmailDomain } from "./email-domain.vo";
import { IpAddress } from "./ip-address.vo";
import type { WhitelistValueProps } from "./whitelist-value.props";
import type { WhitelistValueType } from "./whitelist-value-type";

export class WhitelistValue extends ValueObject<WhitelistValueProps> {
	protected validate(props: WhitelistValueProps): void {
		if (!props.type) {
			throw new VoValidationError("화이트리스트 유형은 필수입니다.");
		}

		if (!props.value) {
			throw new VoValidationError("화이트리스트 값은 필수입니다.");
		}
	}

	public static create(
		type: WhitelistValueType,
		value: string,
	): WhitelistValue {
		return new WhitelistValue({
			type,
			value: WhitelistValue.normalize(type, value),
		});
	}

	public get type(): WhitelistValueType {
		return this.props.type;
	}

	public get value(): string {
		return this.props.value;
	}

	public toString(): string {
		return this.props.value;
	}

	private static normalize(type: WhitelistValueType, value: string): string {
		switch (type) {
			case "IP":
				return IpAddress.create(value).value;
			case "EMAIL_DOMAIN":
				return EmailDomain.create(value).value;
			case "CORS_ORIGIN":
				return CorsOrigin.create(value).value;
		}
	}
}
