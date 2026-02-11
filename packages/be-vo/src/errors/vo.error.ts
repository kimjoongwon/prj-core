/**
 * Value Object 검증 에러
 */
export class VoValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "VoValidationError";
		Error.captureStackTrace(this, this.constructor);
	}
}
