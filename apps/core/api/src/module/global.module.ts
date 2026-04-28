import { createGlobalModules } from "@cocrepo/be-common";
import {
	appConfig,
	authConfig,
	corsConfig,
	objectStorageConfig,
	oidcConfig,
	redisConfig,
	smtpConfig,
} from "../config";

export const globalModules = createGlobalModules({
	envFilePath: ".env",
	configLoaders: [
		oidcConfig,
		authConfig,
		appConfig,
		corsConfig,
		smtpConfig,
		objectStorageConfig,
		redisConfig,
	],
	developmentLoggerMessageFormat: "🕒 {time} {level} - {msg}",
});
