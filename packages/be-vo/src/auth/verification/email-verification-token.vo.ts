import { createHash, randomBytes } from "node:crypto";
import { ValueObject } from "../../common/value-object.base";
import { VoValidationError } from "../../errors/vo.error";
import type { EmailVerificationTokenProps } from "./email-verification-token.props";

export class EmailVerificationToken extends ValueObject<EmailVerificationTokenProps> {
	private static readonly TOKEN_REGEX = /^[a-f0-9]{64}$/;

	protected validate(props: EmailVerificationTokenProps): void {
		if (!props.value) {
			throw new VoValidationError("이메일 인증 토큰은 필수입니다.");
		}

		if (!EmailVerificationToken.TOKEN_REGEX.test(props.value)) {
			throw new VoValidationError(
				"이메일 인증 토큰은 32바이트 hex 형식이어야 합니다.",
			);
		}
	}

	public static create(token: string): EmailVerificationToken {
		return new EmailVerificationToken({ value: token.trim().toLowerCase() });
	}

	public static generate(): EmailVerificationToken {
		return EmailVerificationToken.create(randomBytes(32).toString("hex"));
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
