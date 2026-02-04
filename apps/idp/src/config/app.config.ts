import { registerAs } from "@nestjs/config";

export interface AppConfig {
	name: string;
	port: number;
	env: string;
}

export const appConfig = registerAs(
	"app",
	(): AppConfig => ({
		name: process.env.APP_NAME || "idp",
		port: Number(process.env.APP_PORT) || 3007,
		env: process.env.NODE_ENV || "development",
	}),
);
