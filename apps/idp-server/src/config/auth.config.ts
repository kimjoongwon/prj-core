import { registerAs } from "@nestjs/config";

export interface AuthConfig {
	secret: string;
	bcryptSaltOrRound: number;
}

export const authConfig = registerAs(
	"auth",
	(): AuthConfig => ({
		secret: process.env.AUTH_JWT_SECRET || "default-jwt-secret",
		bcryptSaltOrRound: Number(process.env.AUTH_JWT_SALT_ROUNDS) || 10,
	}),
);
