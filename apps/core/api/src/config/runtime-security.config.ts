import { registerAs } from "@nestjs/config";

const INSECURE_SECRET_VALUES = new Set([
	"default-cookie-secret-change-in-production",
	"dev-jwt-secret",
	"test-jwt-secret",
	"your-jwt-secret",
]);

export interface RuntimeSecurityConfig {
	isProduction: boolean;
	trustProxyHops: number;
	cors: {
		enabled: boolean;
		allowedOrigins: string[];
	};
	swagger: {
		enabled: boolean;
		allowedIps: string[];
		basicAuth?: {
			username: string;
			password: string;
		};
		oauthRedirectUri?: string;
	};
}

const parseBooleanEnvironmentVariable = (
	variableName: string,
	defaultValue: boolean,
): boolean => {
	const rawValue = process.env[variableName]?.trim();
	if (!rawValue) {
		return defaultValue;
	}
	if (rawValue === "true") {
		return true;
	}
	if (rawValue === "false") {
		return false;
	}
	throw new Error(`${variableName} must be either true or false.`);
};

const parseCommaSeparatedEnvironmentVariable = (
	variableName: string,
): string[] =>
	(process.env[variableName] ?? "")
		.split(",")
		.map((rawValue) => rawValue.trim())
		.filter(Boolean);

const requireProductionEnvironmentVariable = (variableName: string): string => {
	const value = process.env[variableName]?.trim();
	if (!value) {
		throw new Error(`${variableName} must be defined in production.`);
	}
	return value;
};

const validateHttpsUrl = (variableName: string, rawValue: string): void => {
	let parsedUrl: URL;
	try {
		parsedUrl = new URL(rawValue);
	} catch {
		throw new Error(`${variableName} must be an absolute HTTPS URL.`);
	}

	if (parsedUrl.protocol !== "https:") {
		throw new Error(`${variableName} must use HTTPS in production.`);
	}
};

const validateCorsOrigins = (
	origins: string[],
	isProduction: boolean,
): void => {
	for (const origin of origins) {
		if (origin === "*") {
			throw new Error("CORS_ALLOWED_ORIGINS cannot contain wildcard origins.");
		}

		let parsedOrigin: URL;
		try {
			parsedOrigin = new URL(origin);
		} catch {
			throw new Error("CORS_ALLOWED_ORIGINS must contain absolute origins.");
		}

		if (parsedOrigin.origin !== origin.replace(/\/+$/, "")) {
			throw new Error("CORS_ALLOWED_ORIGINS must not contain a path or query.");
		}
		if (isProduction && parsedOrigin.protocol !== "https:") {
			throw new Error("CORS_ALLOWED_ORIGINS must use HTTPS in production.");
		}
	}
};

const validateProductionSecret = (variableName: string): void => {
	const value = requireProductionEnvironmentVariable(variableName);
	if (value.length < 32 || INSECURE_SECRET_VALUES.has(value)) {
		throw new Error(
			`${variableName} must be at least 32 characters and not a known default in production.`,
		);
	}
};

const validateProductionDatabaseUrl = (): void => {
	const databaseUrl = requireProductionEnvironmentVariable("DATABASE_URL");
	let parsedUrl: URL;
	try {
		parsedUrl = new URL(databaseUrl);
	} catch {
		throw new Error("DATABASE_URL must be a valid PostgreSQL connection URL.");
	}

	if (
		!["postgres:", "postgresql:"].includes(parsedUrl.protocol) ||
		["localhost", "127.0.0.1", "::1"].includes(parsedUrl.hostname) ||
		(parsedUrl.username === "postgres" && parsedUrl.password === "postgres")
	) {
		throw new Error(
			"DATABASE_URL must not use a local or default PostgreSQL connection in production.",
		);
	}
};

const validateProductionRedisConfiguration = (): void => {
	const redisHost = requireProductionEnvironmentVariable("REDIS_HOST");
	const redisPort = requireProductionEnvironmentVariable("REDIS_PORT");
	const parsedRedisPort = Number(redisPort);
	if (
		["localhost", "127.0.0.1", "::1", "redis.cocdev.co.kr"].includes(
			redisHost,
		) ||
		!Number.isInteger(parsedRedisPort) ||
		parsedRedisPort < 1 ||
		parsedRedisPort > 65535
	) {
		throw new Error(
			"REDIS_HOST and REDIS_PORT must be explicit non-default production values.",
		);
	}
};

const validateProductionOidcConfiguration = (): void => {
	validateProductionSecret("OIDC_COOKIE_SECRET");
	validateHttpsUrl(
		"OIDC_ISSUER",
		requireProductionEnvironmentVariable("OIDC_ISSUER"),
	);
	validateHttpsUrl(
		"OIDC_JWKS_URI",
		requireProductionEnvironmentVariable("OIDC_JWKS_URI"),
	);
	validateHttpsUrl(
		"OIDC_ADMIN_BASE_URL",
		requireProductionEnvironmentVariable("OIDC_ADMIN_BASE_URL"),
	);
	validateHttpsUrl(
		"OIDC_INTERACTION_BASE_URL",
		requireProductionEnvironmentVariable("OIDC_INTERACTION_BASE_URL"),
	);

	const jwksKeys = requireProductionEnvironmentVariable("OIDC_JWKS_KEYS");
	try {
		const parsedJwks = JSON.parse(jwksKeys) as { keys?: unknown };
		if (!Array.isArray(parsedJwks.keys) || parsedJwks.keys.length === 0) {
			throw new Error("OIDC_JWKS_KEYS must contain at least one key.");
		}
	} catch (error) {
		if (error instanceof Error && error.message.includes("at least one key")) {
			throw error;
		}
		throw new Error("OIDC_JWKS_KEYS must be valid non-empty JWKS JSON.");
	}
};

const parseTrustProxyHops = (isProduction: boolean): number => {
	const rawValue = process.env.TRUST_PROXY_HOPS?.trim();
	if (!rawValue) {
		if (isProduction) {
			throw new Error("TRUST_PROXY_HOPS must be defined in production.");
		}
		return 0;
	}

	const trustProxyHops = Number(rawValue);
	if (
		!Number.isInteger(trustProxyHops) ||
		trustProxyHops < 0 ||
		trustProxyHops > 32 ||
		(isProduction && trustProxyHops === 0)
	) {
		throw new Error(
			"TRUST_PROXY_HOPS must be an integer between 1 and 32 in production.",
		);
	}
	return trustProxyHops;
};

export const runtimeSecurityConfig = registerAs(
	"runtimeSecurity",
	(): RuntimeSecurityConfig => {
		const isProduction = process.env.NODE_ENV === "production";
		const corsEnabled = parseBooleanEnvironmentVariable(
			"CORS_ENABLED",
			!isProduction,
		);
		const corsAllowedOrigins = parseCommaSeparatedEnvironmentVariable(
			"CORS_ALLOWED_ORIGINS",
		);
		validateCorsOrigins(corsAllowedOrigins, isProduction);

		if (isProduction) {
			validateProductionSecret("AUTH_JWT_SECRET");
			validateProductionDatabaseUrl();
			validateProductionRedisConfiguration();
			validateProductionOidcConfiguration();
			if (corsEnabled && corsAllowedOrigins.length === 0) {
				throw new Error(
					"CORS_ALLOWED_ORIGINS must be configured when CORS is enabled in production.",
				);
			}
		}

		const swaggerEnabled = parseBooleanEnvironmentVariable(
			"SWAGGER_ENABLED",
			!isProduction,
		);
		const swaggerAllowedIps = parseCommaSeparatedEnvironmentVariable(
			"SWAGGER_ALLOWED_IPS",
		);
		const swaggerUsername = process.env.SWAGGER_BASIC_AUTH_USERNAME?.trim();
		const swaggerPassword = process.env.SWAGGER_BASIC_AUTH_PASSWORD?.trim();
		const swaggerOauthRedirectUri =
			process.env.SWAGGER_OAUTH_REDIRECT_URI?.trim();

		if (isProduction && swaggerEnabled) {
			if (
				!swaggerUsername ||
				!swaggerPassword ||
				swaggerAllowedIps.length === 0
			) {
				throw new Error(
					"Production Swagger requires SWAGGER_BASIC_AUTH_USERNAME, SWAGGER_BASIC_AUTH_PASSWORD, and SWAGGER_ALLOWED_IPS.",
				);
			}
			if (swaggerAllowedIps.includes("*")) {
				throw new Error("SWAGGER_ALLOWED_IPS cannot contain wildcard entries.");
			}
			if (!swaggerOauthRedirectUri) {
				throw new Error(
					"SWAGGER_OAUTH_REDIRECT_URI must be defined when Swagger is enabled in production.",
				);
			}
			validateHttpsUrl("SWAGGER_OAUTH_REDIRECT_URI", swaggerOauthRedirectUri);
		}

		return {
			isProduction,
			trustProxyHops: parseTrustProxyHops(isProduction),
			cors: {
				enabled: corsEnabled,
				allowedOrigins: corsAllowedOrigins,
			},
			swagger: {
				enabled: swaggerEnabled,
				allowedIps: swaggerAllowedIps,
				...(swaggerUsername && swaggerPassword
					? {
							basicAuth: {
								username: swaggerUsername,
								password: swaggerPassword,
							},
						}
					: {}),
				...(swaggerOauthRedirectUri
					? { oauthRedirectUri: swaggerOauthRedirectUri }
					: {}),
			},
		};
	},
);
