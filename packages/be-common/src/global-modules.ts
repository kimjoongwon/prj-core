import type { IncomingMessage, ServerResponse } from "node:http";
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
import type { SignOptions } from "jsonwebtoken";
import { ClsModule } from "nestjs-cls";
import { LoggerModule } from "nestjs-pino";

export type GlobalModuleConfigLoader = ConfigFactory;

export interface CreateGlobalModulesOptions {
	envFilePath: string | string[];
	configLoaders: GlobalModuleConfigLoader[];
	developmentLoggerMessageFormat?: string;
}

type LoggableRequest = IncomingMessage & {
	id?: string | number | object;
};

const REDACTED_LOG_PATHS = [
	"req.headers.authorization",
	"req.headers.cookie",
	'req.headers["x-refresh-token"]',
	"headers.authorization",
	"headers.cookie",
	'headers["x-refresh-token"]',
	"authorization",
	"cookie",
	"x-refresh-token",
];

const getHeaderValue = (
	headers: IncomingMessage["headers"],
	name: string,
): string | string[] | undefined => headers[name.toLowerCase()];

const compactRecord = <T extends Record<string, unknown>>(record: T) =>
	Object.fromEntries(
		Object.entries(record).filter(([, value]) => value !== undefined),
	);

const getRequestLabel = (req: LoggableRequest) => {
	const requestId = req.id === undefined ? "" : `req=${String(req.id)} `;
	const method = req.method ?? "UNKNOWN";
	const url = req.url ?? "";

	return `${requestId}${method} ${url}`;
};

const serializeRequest = (req: LoggableRequest) =>
	compactRecord({
		id: req.id,
		method: req.method,
		url: req.url,
		headers: compactRecord({
			host: getHeaderValue(req.headers, "host"),
			referer: getHeaderValue(req.headers, "referer"),
			"x-forwarded-host": getHeaderValue(req.headers, "x-forwarded-host"),
			"x-tenant-id": getHeaderValue(req.headers, "x-tenant-id"),
			"x-language": getHeaderValue(req.headers, "x-language"),
		}),
		remoteAddress: req.socket?.remoteAddress,
		remotePort: req.socket?.remotePort,
	});

const serializeResponse = (res: ServerResponse) => ({
	statusCode: res.statusCode,
});

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
			const sharedPinoHttpOptions = {
				redact: {
					paths: REDACTED_LOG_PATHS,
					censor: "[REDACTED]",
				},
				wrapSerializers: false,
				serializers: {
					req: serializeRequest,
					res: serializeResponse,
				},
				customLogLevel: (
					_request: IncomingMessage,
					res: ServerResponse,
					error?: Error,
				) => {
					if (error || res.statusCode >= 500) return "error";
					if (res.statusCode >= 400) return "warn";
					return isDevelopment ? "debug" : "info";
				},
				customSuccessMessage: (
					req: LoggableRequest,
					res: ServerResponse,
					responseTime: number,
				) =>
					`${getRequestLabel(req)} ${res.statusCode} ${Math.round(responseTime)}ms`,
				customErrorMessage: (
					req: LoggableRequest,
					res: ServerResponse,
					error: Error,
				) =>
					`${getRequestLabel(req)} ${res.statusCode} errored: ${error.message}`,
			};

			if (isTest) {
				return {
					pinoHttp: {
						...sharedPinoHttpOptions,
						level: "error",
						timestamp: false,
					},
				};
			}

			if (isDevelopment) {
				return {
					pinoHttp: {
						...sharedPinoHttpOptions,
						level: "debug",
						transport: {
							target: "pino-pretty",
							options: {
								colorize: true,
								singleLine: false,
								translateTime: "yyyy-mm-dd HH:MM:ss",
								ignore: "pid,hostname,req,res,responseTime",
								messageFormat:
									options.developmentLoggerMessageFormat ?? "{msg}",
							},
						},
						timestamp: true,
					},
				};
			}

			return {
				pinoHttp: {
					...sharedPinoHttpOptions,
					level: "info",
					timestamp: true,
				},
			};
		},
	}),
];
