import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AccountService } from "./account.service";
import { PrismaOidcAdapterFactory } from "./oidc.adapter";
import { OidcClientRepository } from "./oidc-client.repository";
import type { OidcConfig } from "../../config/oidc.config";

// Koa-like context for oidc-provider
interface KoaLikeContext {
	type: string;
	body: string;
}

// oidc-provider types (ESM module, define locally)
interface OidcConfiguration {
	adapter?: (modelName: string) => unknown;
	findAccount?: (ctx: unknown, id: string, token?: unknown) => Promise<unknown>;
	clients?: Array<{
		client_id: string;
		client_secret?: string;
		client_name?: string;
		redirect_uris: string[];
		grant_types?: string[];
		response_types?: string[];
		token_endpoint_auth_method?: string;
		scope?: string;
	}>;
	claims?: Record<string, string[]>;
	features?: Record<string, { enabled: boolean }>;
	cookies?: {
		keys: string[];
		long?: { httpOnly?: boolean; sameSite?: string; signed?: boolean; path?: string };
		short?: { httpOnly?: boolean; sameSite?: string; signed?: boolean; path?: string };
	};
	ttl?: Record<string, number>;
	interactions?: { url: (ctx: unknown, interaction: { uid: string }) => string };
	pkce?: { required: () => boolean };
	renderError?: (ctx: KoaLikeContext, out: Record<string, unknown>, error: Error) => Promise<void>;
}

export interface InteractionDetails {
	uid: string;
	prompt: {
		name: string;
		details?: {
			missingOIDCScope?: string[];
			[key: string]: unknown;
		};
	};
	params: {
		client_id: string;
		scope?: string;
		[key: string]: unknown;
	};
	session?: {
		accountId?: string;
	};
	grantId?: string;
}

export interface OidcClientInfo {
	clientId: string;
	clientName?: string;
	logoUri?: string;
	[key: string]: unknown;
}

export interface OidcGrant {
	accountId: string;
	clientId: string;
	addOIDCScope: (scope: string) => void;
	addResourceScope: (indicator: string, scope: string) => void;
	save: (ttl?: number) => Promise<string>;
}

interface OidcGrantConstructor {
	new (options: { accountId: string; clientId: string }): OidcGrant;
	find: (grantId: string) => Promise<OidcGrant | undefined>;
}

interface OidcProviderInstance {
	callback: () => (req: unknown, res: unknown) => void;
	on: (event: string, handler: (...args: unknown[]) => void) => void;
	interactionDetails: (req: unknown, res: unknown) => Promise<InteractionDetails>;
	interactionResult: (
		req: unknown,
		res: unknown,
		result: Record<string, unknown>,
		options?: { mergeWithLastSubmission?: boolean }
	) => Promise<string>;
	Client: {
		find: (clientId: string) => Promise<OidcClientInfo | undefined>;
	};
	Grant: OidcGrantConstructor;
}

@Injectable()
export class OidcProviderService {
	private provider: OidcProviderInstance | null = null;
	private readonly logger = new Logger(OidcProviderService.name);

	constructor(
		private readonly configService: ConfigService,
		private readonly accountService: AccountService,
		private readonly adapterFactory: PrismaOidcAdapterFactory,
		private readonly oidcClientRepository: OidcClientRepository,
	) {}

	async initialize(): Promise<void> {
		const oidcConfig = this.configService.get<OidcConfig>("oidc");
		if (!oidcConfig) {
			throw new Error("OIDC config is not defined");
		}

		// Dynamic import for ESM module
		const { default: OidcProvider } = await import("oidc-provider");
		const configuration = await this.getConfiguration();
		// Cast to our interface - oidc-provider is ESM-only so we use local types
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.provider = new OidcProvider(oidcConfig.issuer, configuration as any) as unknown as OidcProviderInstance;

		// Error handling
		this.provider.on("server_error", (ctx, err) => {
			const error = err as Error;
			this.logger.error(`OIDC Server Error: ${error.message}`, error.stack);
		});

		this.provider.on("authorization.error", (ctx, err) => {
			const error = err as Error;
			this.logger.error(`Authorization Error: ${error.message}`);
		});

		this.provider.on("grant.error", (ctx, err) => {
			const error = err as Error;
			this.logger.error(`Grant Error: ${error.message}`);
		});

		this.logger.log("OIDC Provider initialized");
	}

	getProvider() {
		if (!this.provider) {
			throw new Error("OIDC Provider not initialized. Call initialize() first.");
		}
		return this.provider;
	}

	private async getConfiguration(): Promise<OidcConfiguration> {
		const oidcConfig = this.configService.get<OidcConfig>("oidc");

		// DB에서 클라이언트 로드
		const dbClients = await this.loadClientsFromDatabase();

		return {
			adapter: this.adapterFactory.getAdapterFactory(),
			findAccount: this.accountService.findAccount,

			// DB에서 로드한 클라이언트 + 개발용 기본 클라이언트
			clients: [
				...dbClients,
				// seed-data.ts와 동일한 기본 클라이언트 (DB 접근 실패 시 사용)
				{
					client_id: "prj-core-admin",
					client_secret: "admin-secret-change-in-production",
					client_name: "PRJ Core Admin",
					redirect_uris: ["http://localhost:3000/api/auth/callback/oidc"],
					grant_types: ["authorization_code", "refresh_token"],
					response_types: ["code"],
					token_endpoint_auth_method: "client_secret_basic",
					scope: "openid profile email roles",
				},
				{
					client_id: "prj-core-mobile",
					client_name: "PRJ Core Mobile App",
					redirect_uris: [
						"com.prjcore.app://callback",
						"http://localhost:19006/callback",
					],
					grant_types: ["authorization_code", "refresh_token"],
					response_types: ["code"],
					token_endpoint_auth_method: "none", // Public client (PKCE)
					scope: "openid profile email offline_access",
				},
			],

			// 지원하는 클레임 정의
			claims: {
				openid: ["sub"],
				profile: ["name", "updated_at"],
				email: ["email", "email_verified"],
				phone: ["phone_number", "phone_number_verified"],
				roles: ["roles"],
				permissions: ["permissions"],
			},

			// 기능 활성화
			features: {
				devInteractions: { enabled: false }, // 커스텀 로그인 UI 사용
				clientCredentials: { enabled: true },
				introspection: { enabled: true },
				revocation: { enabled: true },
				userinfo: { enabled: true },
				jwtUserinfo: { enabled: false },
				rpInitiatedLogout: { enabled: true },
			},

			// 쿠키 설정
			cookies: {
				keys: oidcConfig?.cookieKeys || ["default-cookie-key"],
				long: {
					httpOnly: true,
					sameSite: "lax",
					signed: true,
					path: "/",
				},
				short: {
					httpOnly: true,
					sameSite: "lax",
					signed: true,
					path: "/",
				},
			},

			// 토큰 TTL
			ttl: {
				AccessToken: 3600, // 1시간
				AuthorizationCode: 600, // 10분
				ClientCredentials: 3600, // 1시간
				DeviceCode: 600, // 10분
				IdToken: 3600, // 1시간
				RefreshToken: 86400 * 30, // 30일
				Interaction: 3600, // 1시간
				Session: 86400 * 14, // 14일
				Grant: 86400 * 14, // 14일
			},

			// Interaction URL (로그인/동의 화면)
			interactions: {
				url: (ctx, interaction) => `/interaction/${interaction.uid}`,
			},

			// PKCE 설정
			pkce: {
				required: () => false, // Public 클라이언트는 PKCE 필수
			},

			// 에러 렌더링
			renderError: async (ctx, out, error) => {
				ctx.type = "html";
				ctx.body = `
					<!DOCTYPE html>
					<html>
					<head>
						<title>Error</title>
						<style>
							body { font-family: sans-serif; padding: 40px; background: #1a1a1a; color: #fff; }
							.error { background: #2a2a2a; padding: 20px; border-radius: 8px; }
							h1 { color: #ef4444; }
							pre { background: #333; padding: 10px; border-radius: 4px; overflow: auto; }
						</style>
					</head>
					<body>
						<div class="error">
							<h1>Error: ${out.error}</h1>
							<p>${out.error_description || ""}</p>
							<pre>${JSON.stringify(out, null, 2)}</pre>
						</div>
					</body>
					</html>
				`;
			},
		};
	}

	/**
	 * DB에서 OIDC 클라이언트 로드
	 * - RLS가 적용된 DB에서는 로드 실패할 수 있음 → 기본 클라이언트 사용
	 */
	private async loadClientsFromDatabase() {
		try {
			const clients = await this.oidcClientRepository.findActiveClients();

			if (clients.length > 0) {
				this.logger.log(`DB에서 ${clients.length}개의 OIDC 클라이언트 로드됨`);
			}

			return clients.map((client) => ({
				client_id: client.clientId,
				client_secret: client.clientSecret || undefined,
				client_name: client.clientName,
				redirect_uris: client.redirectUris,
				grant_types: client.grantTypes,
				response_types: client.responseTypes,
				token_endpoint_auth_method: client.tokenEndpointAuthMethod,
				scope: client.scope,
			}));
		} catch (error) {
			// Supabase RLS로 인해 DB 접근 실패 가능 - 개발 환경에서는 기본 클라이언트 사용
			this.logger.debug("DB에서 클라이언트 로드 실패 (RLS) - 기본 클라이언트 사용");
			return [];
		}
	}
}
