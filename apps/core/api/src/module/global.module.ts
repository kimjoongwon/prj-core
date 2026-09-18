import { createGlobalModules } from "@cocrepo/be-common";
import {
	appConfig,
	authConfig,
	objectStorageConfig,
	oidcConfig,
	redisConfig,
	runtimeSecurityConfig,
	smtpConfig,
} from "../config";

export const globalModules = createGlobalModules({
	envFilePath: ".env",
	configLoaders: [
		runtimeSecurityConfig,
		oidcConfig,
		authConfig,
		appConfig,
		smtpConfig,
		objectStorageConfig,
		redisConfig,
	],
	developmentLoggerMessageFormat: "{msg}",
});
