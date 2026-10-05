import { ValueObject } from "../common/value-object.base";
import { VoValidationError } from "../errors/vo.error";
import type { CorsOriginProps } from "./cors-origin.props";

export class CorsOrigin extends ValueObject<CorsOriginProps> {
	protected validate(props: CorsOriginProps): void {
		if (!props.value) {
			throw new VoValidationError("CORS Origin은 필수입니다.");
		}

		try {
			const url = new URL(props.value);
			if (url.protocol !== "http:" && url.protocol !== "https:") {
				throw new VoValidationError(
					"CORS Origin은 http 또는 https만 허용합니다.",
				);
			}

			if (url.username || url.password || url.search || url.hash) {
				throw new VoValidationError(
					"CORS Origin에는 인증정보, query, hash를 포함할 수 없습니다.",
				);
			}

			if (url.pathname !== "/" && url.pathname !== "") {
				throw new VoValidationError(
					"CORS Origin에는 path를 포함할 수 없습니다.",
				);
			}
		} catch (error) {
			if (error instanceof VoValidationError) {
				throw error;
			}
			throw new VoValidationError("CORS Origin 형식이 올바르지 않습니다.");
		}
	}

	public static create(origin: string): CorsOrigin {
		try {
			const candidate = new CorsOrigin({ value: origin.trim() });
			const url = new URL(candidate.value);
			return new CorsOrigin({ value: url.origin });
		} catch (error) {
			if (error instanceof VoValidationError) {
				throw error;
			}
			throw new VoValidationError("CORS Origin 형식이 올바르지 않습니다.");
		}
	}

	public get value(): string {
		return this.props.value;
	}

	public toString(): string {
		return this.props.value;
	}
}
