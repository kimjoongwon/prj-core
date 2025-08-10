import { DynamicModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MailerModule } from "@nestjs-modules/mailer";
import { ClsModule } from "nestjs-cls";
import { LoggerModule } from "nestjs-pino";
import { PrismaModule } from "nestjs-prisma";
import {
	AuthConfig,
	appConfig,
	authConfig,
	awsConfig,
	corsConfig,
	logConfigFactory,
	smtpConfig,
} from "./shared";

export const modules: (DynamicModule | Promise<DynamicModule>)[] = [
	ConfigModule.forRoot({
		isGlobal: true,
		load: [
			authConfig,
			appConfig,
			corsConfig,
			smtpConfig,
			awsConfig,
			logConfigFactory,
		],
		envFilePath: ".env",
	}),
	MailerModule.forRootAsync({
		useFactory: async (config: ConfigService) => {
			const smtpConfig = await config.get("smtp");
			return {
				transport: {
					host: smtpConfig.host,
					port: smtpConfig.port,
					secure: true,
					auth: {
						user: smtpConfig.username,
						pass: smtpConfig.password,
					},
				},
				defaults: {
					from: smtpConfig.sender,
				},
			};
		},
		inject: [ConfigService],
	}),
	ClsModule.forRoot({
		global: true,
		middleware: {
			mount: true,
		},
	}),
	JwtModule.registerAsync({
		global: true,
		useFactory: async (config: ConfigService) => {
			const authConfig = await config.get<AuthConfig>("auth");
			if (!authConfig?.secret) {
				throw new Error("JWT secret is not defined in the configuration.");
			}

			if (!authConfig?.expires) {
				throw new Error(
					"JWT expiration time is not defined in the configuration.",
				);
			}

			return {
				global: true,
				// secret: authConfig?.secret || 'default',
				// privateKey: authConfig?.secret,
				signOptions: { expiresIn: authConfig?.expires },
				secretOrPrivateKey: authConfig?.secret,
			};
		},
		inject: [ConfigService],
	}),
	PrismaModule.forRoot({
		isGlobal: true,
	}),
	LoggerModule.forRootAsync({
		inject: [ConfigService],
		useFactory: async (configService: ConfigService) => {
			const logConfig = await configService.get("log");

			// Map NestJS log levels to pino log levels
			const logLevelMap = {
				debug: "debug",
				log: "info",
				warn: "warn",
				error: "error",
			};

			// Use the highest priority level from the array
			// Priority: error > warn > log > debug
			let logLevel = "info";
			if (logConfig.level.includes("error")) {
				logLevel = "error";
			} else if (logConfig.level.includes("warn")) {
				logLevel = "warn";
			} else if (logConfig.level.includes("log")) {
				logLevel = "info";
			} else if (logConfig.level.includes("debug")) {
				logLevel = "debug";
			}

			return {
				pinoHttp: {
					level: logLevel,
					transport: logConfig.prettyPrint
						? {
								target: "pino-pretty",
								options: {
									colorize: logConfig.colorize,
									singleLine: true,
									translateTime: "yyyy-mm-dd HH:MM:ss",
									ignore: "pid,hostname",
									messageFormat: "🕒 {time} {level} - {msg}",
								},
							}
						: undefined,
					timestamp: logConfig.timestamp,
				},
			};
		},
	}),
];
