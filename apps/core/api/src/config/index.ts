import appConfig from "./app.config";
import authConfig from "./auth.config";
import objectStorageConfig from "./object-storage.config";
import { oidcConfig } from "./oidc.config";
import redisConfig from "./redis.config";
import { runtimeSecurityConfig } from "./runtime-security.config";
import smtpConfig from "./smtp.config";

export {
	appConfig,
	authConfig,
	oidcConfig,
	objectStorageConfig,
	redisConfig,
	runtimeSecurityConfig,
	smtpConfig,
};
export type {
	AllConfigType,
	AppConfig,
	AuthConfig,
	CorsConfig,
	ObjectStorageConfig,
	ObjectStorageProvider,
	RedisConfig,
	SMTPConfig,
} from "./config.type";
export type { OidcConfig } from "./oidc.config";
export type { RuntimeSecurityConfig } from "./runtime-security.config";
