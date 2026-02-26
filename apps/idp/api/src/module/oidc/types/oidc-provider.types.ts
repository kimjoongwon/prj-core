/**
 * oidc-provider 라이브러리 타입 정의
 *
 * oidc-provider는 ESM-only 패키지로 @types/oidc-provider를 직접 사용할 수 없으므로
 * 필요한 타입을 로컬에서 정의합니다.
 */

// =================================================================
// Express ↔ Koa 호환 타입
// =================================================================

interface ExpressRequest {
	method: string;
	url: string;
	header(name: string): string | undefined;
	[key: string]: unknown;
}

interface ExpressResponse {
	status: number;
	redirect: (url: string) => void;
	render: (view: string, data?: Record<string, unknown>) => string | undefined;
	body?: unknown;
	[key: string]: unknown;
}

export type KoaLikeRequest = ExpressRequest & { [key: string]: unknown };
export type KoaLikeResponse = ExpressResponse & { [key: string]: unknown };

// =================================================================
// Account 관련 타입
// =================================================================

export interface AccountClaims {
	sub: string;
	[key: string]: unknown;
}

export interface ClaimsParameterMember {
	essential?: boolean;
	value?: string;
	values?: string[];
	[key: string]: unknown;
}

export interface Account {
	accountId: string;
	claims: (
		use: string,
		scope: string,
		claims: { [key: string]: ClaimsParameterMember | null },
		rejected: string[],
	) => AccountClaims | Promise<AccountClaims>;
	[key: string]: unknown;
}

export type FindAccount = (
	ctx: unknown,
	id: string,
	token?: unknown,
) => Account | Promise<Account | undefined>;

// =================================================================
// Interaction 관련 타입
// =================================================================

export interface Interaction {
	uid: string;
	prompt: {
		name: string;
		details?: {
			missingOIDCScope?: string[];
			missingResourceScopes?: Record<string, string[]>;
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

// =================================================================
// Grant 관련 타입
// =================================================================

export interface Grant {
	accountId: string;
	clientId: string;
	addOIDCScope: (scope: string) => void;
	addResourceScope: (indicator: string, scope: string) => void;
	save: (ttl?: number) => Promise<string>;
}

// =================================================================
// Client 관련 타입
// =================================================================

export interface OidcClientInfo {
	clientId: string;
	clientName?: string;
	logoUri?: string;
	[key: string]: unknown;
}

export interface OidcClientConfig {
	client_id: string;
	client_secret?: string;
	client_name?: string;
	redirect_uris: string[];
	grant_types?: string[];
	response_types?: string[];
	token_endpoint_auth_method?: string;
	scope?: string;
}

// =================================================================
// Provider Instance 타입
// =================================================================

export interface OidcProviderInstance {
	callback: () => (req: unknown, res: unknown) => void;
	on: (event: string, handler: (...args: unknown[]) => void) => void;
	interactionDetails: (req: unknown, res: unknown) => Promise<Interaction>;
	interactionResult: (
		req: unknown,
		res: unknown,
		result: Record<string, unknown>,
		options?: { mergeWithLastSubmission?: boolean },
	) => Promise<string>;
	Client: {
		find: (clientId: string) => Promise<OidcClientInfo | undefined>;
	};
	Grant: {
		new (options: { accountId: string; clientId: string }): Grant;
		find: (grantId: string) => Promise<Grant | undefined>;
	};
}

// =================================================================
// Configuration 타입
// =================================================================

export interface ResourceServerInfo {
	scope: string;
	audience: string;
	accessTokenFormat: "jwt" | "opaque";
	accessTokenTTL?: number;
	jwt?: {
		sign: { alg: string };
	};
}

export interface ResourceIndicatorsConfig {
	enabled: boolean;
	defaultResource: (ctx: unknown) => string | Promise<string>;
	useGrantedResource: (
		ctx: unknown,
		model?: unknown,
	) => boolean | Promise<boolean>;
	getResourceServerInfo: (
		ctx: unknown,
		resourceIndicator: string,
		client: unknown,
	) => ResourceServerInfo | Promise<ResourceServerInfo>;
}

export interface OidcConfiguration {
	adapter?: (modelName: string) => unknown;
	findAccount?: (ctx: unknown, id: string, token?: unknown) => unknown;
	clients?: OidcClientConfig[];
	claims?: Record<string, string[]>;
	features?: {
		[key: string]: { enabled: boolean } | ResourceIndicatorsConfig | undefined;
		resourceIndicators?: ResourceIndicatorsConfig;
	};
	cookies?: {
		keys: string[];
		long?: {
			httpOnly?: boolean;
			sameSite?: string;
			signed?: boolean;
			path?: string;
		};
		short?: {
			httpOnly?: boolean;
			sameSite?: string;
			signed?: boolean;
			path?: string;
		};
	};
	jwks?: { keys: Array<Record<string, unknown>> };
	ttl?: Record<string, number>;
	interactions?: {
		url: (ctx: unknown, interaction: { uid: string }) => string;
	};
	pkce?: {
		required: (
			ctx: unknown,
			client: { tokenEndpointAuthMethod?: string },
		) => boolean;
	};
	renderError?: (
		ctx: { type: string; body: string },
		out: Record<string, unknown>,
		error: Error,
	) => Promise<void>;
}

// =================================================================
// Adapter 관련 타입
// =================================================================

export interface AdapterPayload {
	[key: string]: unknown;
	accountId?: string;
	acr?: string;
	amr?: string[];
	authTime?: number;
	claims?: object;
	clientId?: string;
	consumed?: number;
	deviceInfo?: object;
	exp?: number;
	grantId?: string;
	gty?: string;
	iat?: number;
	iiat?: number;
	jti?: string;
	kind?: string;
	nonce?: string;
	params?: object;
	resource?: string;
	result?: object;
	rotations?: number;
	scope?: string;
	session?: { uid: string; jti: string };
	sessionUid?: string;
	sid?: string;
	uid?: string;
	userCode?: string;
}

export interface OidcAdapter {
	upsert(id: string, payload: AdapterPayload, expiresIn: number): Promise<void>;
	find(id: string): Promise<AdapterPayload | undefined>;
	findByUserCode?(userCode: string): Promise<AdapterPayload | undefined>;
	findByUid?(uid: string): Promise<AdapterPayload | undefined>;
	destroy(id: string): Promise<void>;
	revokeByGrantId?(grantId: string): Promise<void>;
	consume?(id: string): Promise<void>;
}
