import { ValidationUtil } from "@cocrepo/decorator";
import { registerAs } from "@nestjs/config";
import { IsString } from "class-validator";
import { AuthConfig } from "./config.type";

class EnvironmentVariablesValidator {
	@IsString()
	AUTH_JWT_SECRET!: string;

	@IsString()
	AUTH_JWT_TOKEN_EXPIRES_IN!: string;

	@IsString()
	AUTH_JWT_TOKEN_REFRESH_IN!: string;

	@IsString()
	AUTH_JWT_SALT_ROUNDS!: string;
}

function normalizeJwtDuration(value: string): string | number {
	return /^\d+$/.test(value) ? Number(value) : value;
}

export default registerAs<AuthConfig>("auth", () => {
	ValidationUtil.validateConfig(process.env, EnvironmentVariablesValidator);

	if (!process.env.AUTH_JWT_SECRET) {
		throw new Error("AUTH_JWT_SECRET is not defined");
	}
	if (!process.env.AUTH_JWT_TOKEN_REFRESH_IN) {
		throw new Error("AUTH_JWT_TOKEN_REFRESH_IN is not defined");
	}
	if (!process.env.AUTH_JWT_TOKEN_EXPIRES_IN) {
		throw new Error("AUTH_JWT_TOKEN_EXPIRES_IN is not defined");
	}

	return {
		secret: process.env.AUTH_JWT_SECRET,
		refresh: normalizeJwtDuration(process.env.AUTH_JWT_TOKEN_REFRESH_IN),
		expires: normalizeJwtDuration(process.env.AUTH_JWT_TOKEN_EXPIRES_IN),
		bcryptSaltOrRound: Number(process.env.AUTH_JWT_SALT_ROUNDS),
	};
});
