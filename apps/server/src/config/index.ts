import appConfig from "./app.config";
import authConfig from "./auth.config";
import awsConfig from "./aws.config";
import corsConfig from "./cors.config";
import redisConfig from "./redis.config";
import smtpConfig from "./smtp.config";

export {
	awsConfig,
	appConfig,
	authConfig,
	corsConfig,
	redisConfig,
	smtpConfig,
};
export type {
	AllConfigType,
	AppConfig,
	AppleConfig,
	AuthConfig,
	AwsConfig,
	CorsConfig,
	DatabaseConfig,
	FacebookConfig,
	FileConfig,
	GoogleConfig,
	MailConfig,
	RedisConfig,
	SMTPConfig,
	TwitterConfig,
} from "./config.type";
