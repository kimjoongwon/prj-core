import appConfig from "./app.config";
import authConfig from "./auth.config";
import corsConfig from "./cors.config";
import objectStorageConfig from "./object-storage.config";
import { oidcConfig } from "./oidc.config";
import redisConfig from "./redis.config";
import smtpConfig from "./smtp.config";

export {
	appConfig,
	authConfig,
	corsConfig,
	oidcConfig,
	objectStorageConfig,
	redisConfig,
	smtpConfig,
};
export type {
	AllConfigType,
	AppConfig,
	AppleConfig,
	AuthConfig,
	CorsConfig,
	DatabaseConfig,
	FacebookConfig,
	FileConfig,
	GoogleConfig,
	MailConfig,
	ObjectStorageConfig,
	ObjectStorageProvider,
	RedisConfig,
	SMTPConfig,
	TwitterConfig,
} from "./config.type";
