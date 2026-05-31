import { createHash, randomBytes } from "node:crypto";
import { ValueObject } from "../../common/value-object.base";
import { VoValidationError } from "../../errors/vo.error";
import type { PasswordResetTokenProps } from "./password-reset-token.props";

export class PasswordResetToken extends ValueObject<PasswordResetTokenProps> {
	private static readonly TOKEN_REGEX = /^[a-f0-9]{64}$/;

	protected validate(props: PasswordResetTokenProps): void {
		if (!props.value) {
			throw new VoValidationError("비밀번호 재설정 토큰은 필수입니다.");
		}

		if (!PasswordResetToken.TOKEN_REGEX.test(props.value)) {
			throw new VoValidationError(
				"비밀번호 재설정 토큰은 32바이트 hex 형식이어야 합니다.",
			);
		}
	}

	public static create(token: string): PasswordResetToken {
		return new PasswordResetToken({ value: token.trim().toLowerCase() });
	}

	public static generate(): PasswordResetToken {
		return PasswordResetToken.create(randomBytes(32).toString("hex"));
	}

	public get value(): string {
		return this.props.value;
	}

	public toHash(): string {
		return createHash("sha256").update(this.props.value).digest("hex");
	}

	public toString(): string {
		return this.props.value;
	}
}
