import { createGlobalModules } from "@cocrepo/be-common";
import {
	appConfig,
	authConfig,
	corsConfig,
	oidcConfig,
	redisConfig,
	smtpConfig,
} from "../config";

export const globalModules = createGlobalModules({
	envFilePath: [".env.local", ".env"],
	configLoaders: [
		oidcConfig,
		authConfig,
		redisConfig,
		appConfig,
		corsConfig,
		smtpConfig,
	],
	developmentLoggerMessageFormat: "🔐 {msg}",
});
