import { ValueObject } from "../common/value-object.base";
import { VoValidationError } from "../errors/vo.error";
import type { RedirectUriProps } from "./redirect-uri.props";

export class RedirectUri extends ValueObject<RedirectUriProps> {
	private static readonly SCHEME_REGEX = /^[a-z][a-z0-9+.-]*:$/i;

	protected validate(props: RedirectUriProps): void {
		if (!props.value) {
			throw new VoValidationError("Redirect URI는 필수입니다.");
		}

		try {
			const url = new URL(props.value);
			if (!RedirectUri.SCHEME_REGEX.test(url.protocol)) {
				throw new VoValidationError("Redirect URI scheme이 올바르지 않습니다.");
			}

			if (
				(url.protocol === "http:" || url.protocol === "https:") &&
				!url.hostname
			) {
				throw new VoValidationError("HTTP Redirect URI에는 host가 필요합니다.");
			}
		} catch (error) {
			if (error instanceof VoValidationError) {
				throw error;
			}
			throw new VoValidationError("Redirect URI 형식이 올바르지 않습니다.");
		}
	}

	public static create(uri: string): RedirectUri {
		return new RedirectUri({ value: uri.trim() });
	}

	public get value(): string {
		return this.props.value;
	}

	public toString(): string {
		return this.props.value;
	}
}
