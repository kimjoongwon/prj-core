import { PRISMA_SERVICE_TOKEN } from "@cocrepo/constant";
import type { AuthConfig } from "@cocrepo/type";
import type { DynamicModule } from "@nestjs/common";
import {
	type ConfigFactory,
	ConfigModule,
	ConfigService,
} from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { ThrottlerModule } from "@nestjs/throttler";
import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { MailerModule } from "@nestjs-modules/mailer";
import type { SignOptions } from "jsonwebtoken";
import { ClsModule } from "nestjs-cls";
import { LoggerModule } from "nestjs-pino";

export type GlobalModuleConfigLoader = ConfigFactory;

export interface CreateGlobalModulesOptions {
	envFilePath: string | string[];
	configLoaders: GlobalModuleConfigLoader[];
	developmentLoggerMessageFormat?: string;
}

export const createGlobalModules = (
	options: CreateGlobalModulesOptions,
): (DynamicModule | Promise<DynamicModule>)[] => [
	ConfigModule.forRoot({
		isGlobal: true,
		envFilePath: options.envFilePath,
		load: options.configLoaders,
	}),
	ThrottlerModule.forRoot(
		process.env.NODE_ENV === "production"
			? [
					{ name: "short", ttl: 1000, limit: 10 },
					{ name: "medium", ttl: 60000, limit: 100 },
					{ name: "long", ttl: 900000, limit: 1000 },
				]
			: [
					{ name: "short", ttl: 1000, limit: 1000 },
					{ name: "medium", ttl: 60000, limit: 10000 },
					{ name: "long", ttl: 900000, limit: 100000 },
				],
	),
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
			const authConf = config.get<AuthConfig>("auth");
			if (!authConf) {
				throw new Error("Auth config is not defined.");
			}
			if (!authConf.secret) {
				throw new Error("JWT secret is not defined in the configuration.");
			}
			if (!authConf.expires) {
				throw new Error(
					"JWT expiration time is not defined in the configuration.",
				);
			}

			return {
				global: true,
				secret: authConf.secret,
				signOptions: {
					expiresIn: authConf.expires as SignOptions["expiresIn"],
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

			if (isTest) {
				return {
					pinoHttp: {
						level: "error",
						timestamp: false,
					},
				};
			}

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
								messageFormat:
									options.developmentLoggerMessageFormat ?? "🔐 {msg}",
							},
						},
						timestamp: true,
					},
				};
			}

			return {
				pinoHttp: {
					level: "info",
					timestamp: true,
				},
			};
		},
	}),
];
