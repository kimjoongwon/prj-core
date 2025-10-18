import { DynamicModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MailerModule } from "@nestjs-modules/mailer";
import { ClsModule } from "nestjs-cls";
import { LoggerModule } from "nestjs-pino";
import {
	AuthConfig,
	appConfig,
	authConfig,
	awsConfig,
	corsConfig,
	smtpConfig,
} from "./shared";

export const globalModules: (DynamicModule | Promise<DynamicModule>)[] = [
	ConfigModule.forRoot({
		isGlobal: true,
		load: [authConfig, appConfig, corsConfig, smtpConfig, awsConfig],
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
				privateKey: authConfig?.secret,
				signOptions: { expiresIn: authConfig?.expires as string },
			};
		},
		inject: [ConfigService],
	}),
	LoggerModule.forRootAsync({
		inject: [ConfigService],
		useFactory: () => {
			const isDevelopment = process.env.NODE_ENV !== "production";
			const isTest = process.env.NODE_ENV === "test";

			// Test 환경: 에러만 로깅
			if (isTest) {
				return {
					pinoHttp: {
						level: "error",
						timestamp: false,
					},
				};
			}

			// Development 환경: 상세 로깅
			if (isDevelopment) {
				return {
					pinoHttp: {
						level: "debug",
						transport: {
							target: "pino-pretty",
							options: {
								colorize: true,
								singleLine: true,
								translateTime: "yyyy-mm-dd HH:MM:ss",
								ignore: "pid,hostname",
								messageFormat: "🕒 {time} {level} - {msg}",
							},
						},
						timestamp: true,
					},
				};
			}

			// Production 환경: JSON 로그
			return {
				pinoHttp: {
					level: "info",
					timestamp: true,
				},
			};
		},
	}),
];
