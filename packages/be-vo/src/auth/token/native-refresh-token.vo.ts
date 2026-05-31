import { randomBytes } from "node:crypto";
import { ValueObject } from "../../common/value-object.base";
import { VoValidationError } from "../../errors/vo.error";
import type { NativeRefreshTokenProps } from "./native-refresh-token.props";

export class NativeRefreshToken extends ValueObject<NativeRefreshTokenProps> {
	private static readonly TOKEN_REGEX = /^[A-Za-z0-9_-]{43}$/;

	protected validate(props: NativeRefreshTokenProps): void {
		if (!props.value) {
			throw new VoValidationError("Native Refresh Token은 필수입니다.");
		}

		if (!NativeRefreshToken.TOKEN_REGEX.test(props.value)) {
			throw new VoValidationError(
				"Native Refresh Token은 32바이트 base64url 형식이어야 합니다.",
			);
		}
	}

	public static create(token: string): NativeRefreshToken {
		return new NativeRefreshToken({ value: token.trim() });
	}

	public static generate(): NativeRefreshToken {
		return NativeRefreshToken.create(randomBytes(32).toString("base64url"));
	}

	public get value(): string {
		return this.props.value;
	}

	public toString(): string {
		return this.props.value;
	}
}
