import appConfig from "./app.config";
import authConfig from "./auth.config";
import awsConfig from "./aws.config";
import corsConfig from "./cors.config";
import smtpConfig from "./smtp.config";

export { awsConfig, appConfig, authConfig, corsConfig, smtpConfig };
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
	SMTPConfig,
	TwitterConfig,
} from "./config.type";
