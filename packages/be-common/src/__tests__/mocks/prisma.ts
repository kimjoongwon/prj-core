// Entity의 EnumField는 실제 enum 값을 읽으므로 DB client만 mock하고 생성 enum은 보존합니다.
export * from "../../../../be-prisma/dist/src/generated/client/enums";

export class PrismaClient {}

class PrismaClientKnownRequestError extends Error {
	code: string;
	meta?: Record<string, unknown>;

	constructor(
		message = "",
		codeOrParams:
			| string
			| {
					code: string;
					clientVersion?: string;
					meta?: Record<string, unknown>;
			  } = "P0000",
		meta?: Record<string, unknown>,
	) {
		super(message);
		if (typeof codeOrParams === "string") {
			this.code = codeOrParams;
			this.meta = meta;
			return;
		}

		this.code = codeOrParams.code;
		this.meta = codeOrParams.meta;
	}
}

class PrismaClientValidationError extends Error {}

export const Prisma = {
	PrismaClientKnownRequestError,
	PrismaClientValidationError,
};
