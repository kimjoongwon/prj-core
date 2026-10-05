import { ValueObject } from "../common/value-object.base";
import { VoValidationError } from "../errors/vo.error";
import type { OidcClientIdProps } from "./oidc-client-id.props";

export class OidcClientId extends ValueObject<OidcClientIdProps> {
	private static readonly CLIENT_ID_REGEX = /^[a-z0-9-]{1,64}$/;

	protected validate(props: OidcClientIdProps): void {
		if (!props.value) {
			throw new VoValidationError("OIDC Client ID는 필수입니다.");
		}

		if (!OidcClientId.CLIENT_ID_REGEX.test(props.value)) {
			throw new VoValidationError(
				"OIDC Client ID는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.",
			);
		}
	}

	public static create(clientId: string): OidcClientId {
		return new OidcClientId({ value: clientId.trim().toLowerCase() });
	}

	public get value(): string {
		return this.props.value;
	}

	public toString(): string {
		return this.props.value;
	}
}
