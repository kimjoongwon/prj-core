import { randomBytes } from "node:crypto";
import { ValueObject } from "../../common/value-object.base";
import { VoValidationError } from "../../errors/vo.error";
import { OidcClientId } from "../../oidc/oidc-client-id.vo";
import { SESSION_ID_SEPARATOR } from "./session-id-separator";
import type { SessionIdProps } from "./session-id.props";

export class SessionId extends ValueObject<SessionIdProps> {
	private static readonly RAW_ID_REGEX = /^[a-f0-9]{32}$/;

	protected validate(props: SessionIdProps): void {
		if (!props.value) {
			throw new VoValidationError("Session ID는 필수입니다.");
		}

		if (!props.clientId) {
			throw new VoValidationError("Session ID의 clientId는 필수입니다.");
		}

		if (!SessionId.RAW_ID_REGEX.test(props.rawId)) {
			throw new VoValidationError(
				"Session ID의 rawId는 16바이트 hex 형식이어야 합니다.",
			);
		}

		const expectedValue = `${props.clientId}${SESSION_ID_SEPARATOR}${props.rawId}`;
		if (props.value !== expectedValue) {
			throw new VoValidationError("Session ID 조합이 올바르지 않습니다.");
		}
	}

	public static create(clientId: string, rawId: string): SessionId {
		const normalizedClientId = OidcClientId.create(clientId).value;
		const normalizedRawId = rawId.trim().toLowerCase();
		return new SessionId({
			value: `${normalizedClientId}${SESSION_ID_SEPARATOR}${normalizedRawId}`,
			clientId: normalizedClientId,
			rawId: normalizedRawId,
		});
	}

	public static fromString(value: string): SessionId {
		const trimmedValue = value.trim();
		const separatorIndex = trimmedValue.indexOf(SESSION_ID_SEPARATOR);

		if (separatorIndex <= 0) {
			throw new VoValidationError("Session ID 형식이 올바르지 않습니다.");
		}

		return SessionId.create(
			trimmedValue.slice(0, separatorIndex),
			trimmedValue.slice(separatorIndex + SESSION_ID_SEPARATOR.length),
		);
	}

	public static generateRawId(): string {
		return randomBytes(16).toString("hex");
	}

	public get value(): string {
		return this.props.value;
	}

	public get clientId(): string {
		return this.props.clientId;
	}

	public get rawId(): string {
		return this.props.rawId;
	}

	public toString(): string {
		return this.props.value;
	}
}
