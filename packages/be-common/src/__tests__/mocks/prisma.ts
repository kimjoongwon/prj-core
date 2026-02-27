export class PrismaClient {}

class PrismaClientKnownRequestError extends Error {
	code = "P0000";
	meta?: Record<string, unknown>;
}

class PrismaClientValidationError extends Error {}

export const Prisma = {
	PrismaClientKnownRequestError,
	PrismaClientValidationError,
};
