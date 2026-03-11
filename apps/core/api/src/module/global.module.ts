import { createGlobalModules } from "@cocrepo/be-common";
import {
	appConfig,
	authConfig,
	awsConfig,
	corsConfig,
	redisConfig,
	smtpConfig,
} from "../config";

export const globalModules = createGlobalModules({
	envFilePath: ".env",
	configLoaders: [
		authConfig,
		appConfig,
		corsConfig,
		smtpConfig,
		awsConfig,
		redisConfig,
	],
	developmentLoggerMessageFormat: "🕒 {time} {level} - {msg}",
});
