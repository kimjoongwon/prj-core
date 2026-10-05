import { isIP } from "node:net";
import { ValueObject } from "../common/value-object.base";
import { VoValidationError } from "../errors/vo.error";
import type { IpAddressProps } from "./ip-address.props";

export class IpAddress extends ValueObject<IpAddressProps> {
	protected validate(props: IpAddressProps): void {
		if (!props.value) {
			throw new VoValidationError("IP 주소는 필수입니다.");
		}

		const [address, prefix, ...rest] = props.value.split("/");
		if (rest.length > 0 || !address) {
			throw new VoValidationError("IP 주소 형식이 올바르지 않습니다.");
		}

		const version = isIP(address);
		if (!version) {
			throw new VoValidationError("IP 주소 형식이 올바르지 않습니다.");
		}

		if (prefix === undefined) {
			return;
		}

		if (!/^\d+$/.test(prefix)) {
			throw new VoValidationError("CIDR prefix는 숫자여야 합니다.");
		}

		const prefixLength = Number(prefix);
		const maxPrefixLength = version === 4 ? 32 : 128;
		if (prefixLength < 0 || prefixLength > maxPrefixLength) {
			throw new VoValidationError("CIDR prefix 범위가 올바르지 않습니다.");
		}
	}

	public static create(value: string): IpAddress {
		return new IpAddress({ value: value.trim().toLowerCase() });
	}

	public get value(): string {
		return this.props.value;
	}

	public toString(): string {
		return this.props.value;
	}
}
