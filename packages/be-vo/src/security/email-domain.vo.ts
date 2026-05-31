import { ValueObject } from "../common/value-object.base";
import { VoValidationError } from "../errors/vo.error";
import type { EmailDomainProps } from "./email-domain.props";

export class EmailDomain extends ValueObject<EmailDomainProps> {
	private static readonly DOMAIN_REGEX =
		/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/;

	protected validate(props: EmailDomainProps): void {
		if (!props.value) {
			throw new VoValidationError("이메일 도메인은 필수입니다.");
		}

		if (props.value.includes("/") || props.value.includes(":")) {
			throw new VoValidationError(
				"이메일 도메인에는 URL 형식을 사용할 수 없습니다.",
			);
		}

		if (!EmailDomain.DOMAIN_REGEX.test(props.value)) {
			throw new VoValidationError("이메일 도메인 형식이 올바르지 않습니다.");
		}
	}

	public static create(domain: string): EmailDomain {
		return new EmailDomain({
			value: domain.trim().replace(/^@/, "").toLowerCase(),
		});
	}

	public get value(): string {
		return this.props.value;
	}

	public toString(): string {
		return this.props.value;
	}
}
