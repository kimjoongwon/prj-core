import { createGlobalModules } from "@cocrepo/be-common";
import {
	authConfig,
	corsConfig,
	oidcConfig,
	redisConfig,
	smtpConfig,
} from "../config";

export const globalModules = createGlobalModules({
	envFilePath: ".env",
	configLoaders: [oidcConfig, authConfig, redisConfig, corsConfig, smtpConfig],
	developmentLoggerMessageFormat: "🔐 {msg}",
});
