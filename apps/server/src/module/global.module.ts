import { PRISMA_SERVICE_TOKEN } from "@cocrepo/constant";
import { DynamicModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { ThrottlerModule } from "@nestjs/throttler";
import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { MailerModule } from "@nestjs-modules/mailer";
import type { SignOptions } from "jsonwebtoken";
import { ClsModule } from "nestjs-cls";
import { LoggerModule } from "nestjs-pino";
import {
	type AuthConfig,
	appConfig,
	authConfig,
	awsConfig,
	corsConfig,
	redisConfig,
	smtpConfig,
} from "../config";

export const globalModules: (DynamicModule | Promise<DynamicModule>)[] = [
	ConfigModule.forRoot({
		isGlobal: true,
		envFilePath: ".env",
		load: [
			authConfig,
			appConfig,
			corsConfig,
			smtpConfig,
			awsConfig,
			redisConfig,
		],
	}),
	ThrottlerModule.forRoot([
		{
			name: "short",
			ttl: 1000, // 1초
			limit: 10, // 1초당 10개 요청
		},
		{
			name: "medium",
			ttl: 60000, // 1분
			limit: 100, // 1분당 100개 요청
		},
		{
			name: "long",
			ttl: 900000, // 15분
			limit: 1000, // 15분당 1000개 요청
		},
	]),
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
		plugins: [
			new ClsPluginTransactional({
				imports: [],
				adapter: new TransactionalAdapterPrisma({
					prismaInjectionToken: PRISMA_SERVICE_TOKEN,
				}),
			}),
		],
	}),
	JwtModule.registerAsync({
		global: true,
		useFactory: (config: ConfigService) => {
			const authConfig = config.get<AuthConfig>("auth");
			if (!authConfig) {
				throw new Error("Auth config is not defined.");
			}
			if (!authConfig.secret) {
				throw new Error("JWT secret is not defined in the configuration.");
			}
			if (!authConfig.expires) {
				throw new Error(
					"JWT expiration time is not defined in the configuration.",
				);
			}

			return {
				global: true,
				secret: authConfig.secret,
				signOptions: {
					expiresIn: authConfig.expires as SignOptions["expiresIn"],
				},
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
