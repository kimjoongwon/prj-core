/**
 * oidc-provider 라이브러리 타입 정의
 *
 * oidc-provider는 ESM-only 패키지로 @types/oidc-provider를 직접 사용할 수 없으므로
 * 필요한 타입을 로컬에서 정의합니다.
 */

// =================================================================
// Account 관련 타입
// =================================================================

export interface AccountClaims {
	sub: string;
	roles?: AccountRoleClaim[];
	spaces?: AccountSpaceClaim[];
	[key: string]: unknown;
}

export interface AccountRoleClaim {
	spaceId: string;
	roleId: string;
	roleName?: string;
	roleDisplayName?: string | null;
}

export interface AccountSpaceClaim {
	spaceId: string;
	fitnessCenterName?: string;
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
		prompt?: string;
		resource?: string | string[];
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
	name?: string;
	logoUri?: string;
	loginUi?: unknown;
	[key: string]: unknown;
}

export interface RawOidcProviderClient {
	clientId: string;
	clientName?: string;
	logoUri?: string;
	[key: string]: unknown;
}

export interface OidcClientConfig {
	client_id: string;
	client_secret?: string;
	client_name?: string;
	application_type?: "native" | "web";
	redirect_uris: string[];
	post_logout_redirect_uris?: string[];
	grant_types?: string[];
	response_types?: string[];
	token_endpoint_auth_method?: string;
	scope?: string;
	logo_uri?: string;
	policy_uri?: string;
	tos_uri?: string;
}

export interface OidcProviderContext {
	oidc?: {
		account?: {
			accountId: string;
		};
		client?: {
			clientId: string;
		};
		/**
		 * provider가 검증을 통과한 요청 매개변수와 자격. IdTokenHint는
		 * id_token_hint가 제공·검증되었을 때만 존재한다.
		 */
		entities?: {
			IdTokenHint?: unknown;
		};
		params?: {
			client_id?: string;
			prompt?: string;
			resource?: string | string[];
			scope?: string;
		};
		provider?: OidcProviderInstance;
		result?: {
			consent?: {
				grantId?: string;
			};
		};
		session?: {
			grantIdFor: (clientId: string) => string | undefined;
		};
	};
}

// =================================================================
// Provider Instance 타입
// =================================================================

export interface OidcProviderInstance {
	callback: () => (req: unknown, res: unknown) => void;
	on: (event: string, handler: (...args: unknown[]) => void) => void;
	proxy?: boolean;
	interactionDetails: (req: unknown, res: unknown) => Promise<Interaction>;
	interactionResult: (
		req: unknown,
		res: unknown,
		result: Record<string, unknown>,
		options?: { mergeWithLastSubmission?: boolean },
	) => Promise<string>;
	Client: {
		find: (clientId: string) => Promise<RawOidcProviderClient | undefined>;
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

export interface RpInitiatedLogoutConfig {
	enabled: boolean;
	/**
	 * end_session 확인 화면. 검증된 id_token_hint를 가진 최초파티 클라이언트는
	 * 사용자가 이미 로그아웃을 눌렀으므로 폼을 자동 제출해 바로 진행한다.
	 * 그 외(id_token_hint가 없거나 검증되지 않았거나 third-party 클라이언트)에는
	 * 확인 버튼이 있는 화면을 렌더해 사용자 확인(RP-Initiated Logout 필수 조건)을
	 * 거친다. provider가 만든 form HTML을 받아 이를 포함한 페이지를 렌더하면 된다.
	 */
	logoutSource?: (
		ctx: OidcProviderContext & { type: string; body: string },
		form: string,
	) => unknown;
	/**
	 * end_session 완료 화면. 클라이언트 로그인 화면으로 되돌릴 때 사용한다.
	 * render를 호출하면 기본 안내 화면이 렌더된다.
	 */
	postLogoutSuccessSource?: (
		ctx: OidcProviderContext & { type: string; body: string },
		render: () => unknown,
	) => unknown;
}

export interface OidcConfiguration {
	adapter?: (modelName: string) => unknown;
	findAccount?: (ctx: unknown, id: string, token?: unknown) => unknown;
	clients?: OidcClientConfig[];
	claims?: Record<string, string[]>;
	features?: {
		[key: string]:
			| { enabled: boolean }
			| ResourceIndicatorsConfig
			| RpInitiatedLogoutConfig
			| undefined;
		resourceIndicators?: ResourceIndicatorsConfig;
		rpInitiatedLogout?: RpInitiatedLogoutConfig;
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
		url: (ctx: unknown, interaction: Pick<Interaction, "uid" | "prompt">) => string;
	};
	pkce?: {
		required: (
			ctx: unknown,
			client: { tokenEndpointAuthMethod?: string },
		) => boolean;
	};
	loadExistingGrant?: (ctx: OidcProviderContext) => Promise<Grant | undefined>;
	issueRefreshToken?: (
		ctx: unknown,
		client: {
			clientId?: string;
			grantTypeAllowed?: (grantType: string) => boolean;
		},
		code: { scopes?: Set<string> },
	) => boolean | Promise<boolean>;
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
