import { PRISMA_SERVICE_TOKEN } from "@cocrepo/constant";
import type { DynamicModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { ClsModule } from "nestjs-cls";
import { LoggerModule } from "nestjs-pino";
import { appConfig, authConfig, oidcConfig, redisConfig } from "../config";

export const globalModules: (DynamicModule | Promise<DynamicModule>)[] = [
	ConfigModule.forRoot({
		isGlobal: true,
		envFilePath: [".env.local", ".env"],
		load: [oidcConfig, authConfig, redisConfig, appConfig],
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
								messageFormat: "🔐 {msg}",
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
