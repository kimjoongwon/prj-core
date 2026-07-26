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
