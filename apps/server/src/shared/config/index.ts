// import databaseConfig from './database.config';
import appConfig from "./app.config";
import authConfig from "./auth.config";
import awsConfig from "./aws.config";
import corsConfig from "./cors.config";
import logConfigFactory, { logConfig } from "./log.config";
import smtpConfig from "./smtp.config";
// import fileConfig from './file.config';
// import mailConfig from './mail.config';

export {
	awsConfig,
	// databaseConfig,
	appConfig,
	authConfig,
	corsConfig,
	logConfig,
	logConfigFactory,
	smtpConfig,
	// fileConfig,
	// mailConfig,
};
export * from "./config.type";
