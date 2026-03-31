import { CONTEXT_KEYS, SYSTEM_ROLES, Token } from "@cocrepo/constant";
import {
	PageMetaDto,
	QueryAuthAuditLogDto,
	SetCurrentSpaceDto,
	SpaceDto,
	TokenRefreshResponseDto,
	UserDto,
	VerifyTokenResponseDto,
} from "@cocrepo/dto";
import {
	type OidcClientProtocolConfig,
	OidcFacade,
} from "@cocrepo/integration";
import {
	AuthAuditLogService,
	AuthCacheService,
	EmailService,
	type GetAuditLogsResult,
	OidcClientService,
	RoleService,
	type SessionInfo,
	SpaceService,
	TokenService,
	TokenStorageService,
	UserService,
} from "@cocrepo/service";
import { Cookie, HashedPassword, PlainPassword } from "@cocrepo/vo";
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	Logger,
	UnauthorizedException,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import type { Request, Response } from "express";
import { ClsService } from "nestjs-cls";

const DEFAULT_OIDC_CLIENT_ID = "admin-web";
const OIDC_STATE_CONTEXT_PREFIX = "__oidc_ctx__:";
const SESSION_ID_SEPARATOR = ".";

const LEGACY_OIDC_CLIENT_ID_MAP = {
	admin: "admin-web",
	storybook: "storybook",
	idpWeb: "idp-web",
} as const;

interface OidcStateContext {
	clientId: string;
	returnTo?: string;
}

interface ResolvedOidcClient {
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
	loginUrl: string;
	defaultReturnTo: string;
}

interface OidcCallbackResult {
	returnTo?: string;
	defaultReturnTo: string;
	loginUrl: string;
}

type SpaceTenantLike = {
	spaceId: string;
	role?: {
		name?: string | null;
	} | null;
};

type UserWithTenantsLike = {
	tenants?: SpaceTenantLike[];
};

/**
 * 인증 Application Service
 * OIDC 기반 인증 유즈케이스를 조합하고 내부 서비스 및 Integration Facade를 호출합니다.
 *
 * ✅ Service Layer를 통해 데이터 접근
 * ✅ 외부 OIDC 연동은 OidcFacade를 통해 처리
 * ❌ Prisma 직접 호출 금지
 */
@Injectable()
export class AuthApplicationService {
	private readonly logger = new Logger(AuthApplicationService.name);

	constructor(
		private readonly usersService: UserService,
		private readonly rolesService: RoleService,
		private readonly spacesService: SpaceService,
		private readonly tokenService: TokenService,
		private readonly tokenStorageService: TokenStorageService,
		private readonly authCacheService: AuthCacheService,
		private readonly authAuditLogService: AuthAuditLogService,
		private readonly emailService: EmailService,
		private readonly oidcClientService: OidcClientService,
		private readonly oidcFacade: OidcFacade,
		private readonly cls: ClsService,
	) {}

	/**
	 * OIDC Authorization URL 생성
	 * state(CSRF 방지) + PKCE(code_verifier/code_challenge) 적용
	 * @param returnTo 인증 완료 후 리다이렉트할 프론트엔드 경로 (예: /admin/dashboard)
	 */
	async getAuthorizationUrl(
		returnTo?: string,
		clientId = DEFAULT_OIDC_CLIENT_ID,
	): Promise<string> {
		const client = await this.resolveAuthShellClient(clientId);
		const { state, codeVerifier, authorizationUrl } =
			this.oidcFacade.createAuthorizationRequest(
				this.toProtocolClientConfig(client),
				returnTo,
			);

		// state와 code_verifier, returnTo/clientId 컨텍스트를 함께 Redis에 저장
		await this.tokenStorageService.saveOidcState(
			state,
			codeVerifier,
			600,
			returnTo,
			client.clientId,
		);
		return authorizationUrl;
	}

	/**
	 * OIDC Callback 처리 - Authorization Code → Token 교환
	 * state 검증(CSRF 방지) + PKCE code_verifier 적용
	 * HttpOnly 쿠키에 토큰을 저장하고 세션을 생성합니다.
	 * @returns returnTo 경로 (인증 완료 후 리다이렉트할 프론트엔드 경로)
	 */
	async handleOidcCallback(
		code: string,
		state: string,
		req: Request,
		res: Response,
	): Promise<OidcCallbackResult> {
		// OIDC state 검증 + PKCE code_verifier 조회 (일회용 - 검증 후 즉시 소비)
		const stateData =
			await this.tokenStorageService.validateAndConsumeOidcState(state);
		if (!stateData) {
			throw new UnauthorizedException("OIDC state 검증에 실패했습니다");
		}

		const {
			codeVerifier,
			returnTo: storedReturnTo,
			clientId: storedClientId,
			clientKey: legacyStoredClientKey,
		} = stateData;
		const { clientId: legacyClientId, returnTo: legacyReturnTo } =
			this.decodeOidcStateContext(storedReturnTo);
		const clientId = this.resolveStoredClientId(
			storedClientId,
			legacyStoredClientKey,
			legacyClientId,
		);
		const returnTo = legacyReturnTo ?? storedReturnTo;
		const client = await this.resolveAuthShellClient(clientId, {
			requireActive: false,
		});

		// IDP token endpoint에 code + code_verifier 교환
		const tokenResponse = await this.oidcFacade.exchangeCodeForTokens(
			code,
			codeVerifier,
			this.toProtocolClientConfig(client),
		);

		// access_token에서 사용자 정보 추출 (sub, exp claim)
		const payload = this.decodeAccessToken(tokenResponse.access_token);
		const user = await this.usersService.getByIdWithTenants(payload.sub);

		if (!user) {
			throw new UnauthorizedException("사용자를 찾을 수 없습니다");
		}

		// 인증 사용자 캐시 미리 적재 (첫 API 요청 시 DB 재조회 방지)
		const expSeconds = (payload as { exp?: number }).exp ?? 0;
		const remainingSeconds = expSeconds - Math.floor(Date.now() / 1000);
		if (remainingSeconds > 0) {
			await this.authCacheService.set(
				payload.sub,
				JSON.stringify(user),
				remainingSeconds,
			);
		}

		// 세션 생성 및 저장 (멀티 디바이스 지원)
		const sessionId = this.buildSessionId(
			client.clientId,
			this.tokenStorageService.generateSessionId(),
		);
		if (tokenResponse.refresh_token) {
			await this.tokenStorageService.saveSession(
				payload.sub,
				sessionId,
				tokenResponse.refresh_token,
				{
					userAgent: req.headers["user-agent"] || "unknown",
					ipAddress: req.ip || req.socket.remoteAddress || "unknown",
					clientId: client.clientId,
				},
			);
		}

		// HttpOnly 쿠키에 토큰 + 세션 ID 저장
		this.setTokenCookies(
			res,
			tokenResponse.access_token,
			tokenResponse.refresh_token,
		);
		this.setSessionIdCookie(res, sessionId);
		await this.reconcileSelectedSpaceCookie(user, undefined, res);

		return {
			returnTo,
			defaultReturnTo: client.defaultReturnTo,
			loginUrl: client.loginUrl,
		};
	}

	async refreshTokenWithIdp(
		refreshToken: string,
		sessionId: string | undefined,
		selectedSpaceId: string | undefined,
		res: Response,
	): Promise<TokenRefreshResponseDto> {
		if (!refreshToken) {
			throw new UnauthorizedException("리프레시 토큰이 존재하지 않습니다");
		}

		const clientId = this.resolveClientIdFromSessionId(sessionId);
		const client = await this.resolveOidcClient(clientId, {
			requireActive: false,
			requireAuthShell: false,
		});
		const tokenResponse = await this.oidcFacade.refreshTokens(
			refreshToken,
			this.toProtocolClientConfig(client),
		);

		// 사용자 정보 조회
		const payload = this.decodeAccessToken(tokenResponse.access_token);
		const user = await this.usersService.getByIdWithTenants(payload.sub);

		if (!user) {
			throw new UnauthorizedException("사용자를 찾을 수 없습니다");
		}

		// 세션 활동 시간 및 refresh token 업데이트
		if (sessionId) {
			const newRefreshToken = tokenResponse.refresh_token || refreshToken;
			await this.tokenStorageService.updateSession(
				payload.sub,
				sessionId,
				newRefreshToken,
			);
		}

		// 새 토큰으로 쿠키 업데이트
		this.setTokenCookies(
			res,
			tokenResponse.access_token,
			tokenResponse.refresh_token,
		);
		await this.reconcileSelectedSpaceCookie(user, selectedSpaceId, res);

		const now = Date.now();

		return {
			accessToken: tokenResponse.access_token,
			refreshToken: tokenResponse.refresh_token || refreshToken,
			accessTokenExpiresAt: now + tokenResponse.expires_in * 1000,
			refreshTokenExpiresAt: now + 30 * 24 * 60 * 60 * 1000,
			user: plainToInstance(UserDto, user),
		};
	}

	/**
	 * 로그아웃 - IDP Revocation + 블랙리스트 + 세션 삭제 + 쿠키 삭제
	 */
	async logoutWithCookie(
		accessToken: string | undefined,
		sessionId: string | undefined,
		res: Response,
	): Promise<boolean> {
		if (accessToken) {
			const clientId = this.resolveClientIdFromSessionId(sessionId);

			// 1. IDP에 토큰 무효화 요청 (best-effort)
			const client = await this.resolveOidcClient(clientId, {
				requireActive: false,
				requireAuthShell: false,
			});
			await this.oidcFacade.revokeToken(
				accessToken,
				this.toProtocolClientConfig(client),
			);

			try {
				// 2. Access Token 블랙리스트 등록 (JwtAuthGuard에서 차단)
				const payload = this.decodeAccessToken(accessToken);
				const expSeconds = (payload as { exp?: number }).exp ?? 0;
				const remainingSeconds = expSeconds - Math.floor(Date.now() / 1000);
				if (remainingSeconds > 0) {
					await this.tokenStorageService.addToBlacklist(
						accessToken,
						remainingSeconds,
					);
				}

				// 3. 현재 세션 삭제 (Redis)
				if (sessionId) {
					await this.tokenStorageService.deleteSession(payload.sub, sessionId);
				} else {
					// sessionId가 없으면 사용자 기준으로 세션을 정리합니다.
					await this.tokenStorageService.deleteRefreshToken(payload.sub);
				}
			} catch (error) {
				this.logger.warn(`로그아웃 토큰 정리 실패: ${error}`);
			}
		}

		// 4. 쿠키 삭제
		this.clearTokenCookies(res);
		res.clearCookie(Token.SESSION_ID);
		this.tokenService.clearSelectedSpaceCookie(res);
		res.clearCookie("tenantId");
		res.clearCookie("workspaceId");

		return true;
	}

	/**
	 * Access Token에서 payload 디코딩 (검증 없이, 검증은 JwtStrategy에서 수행)
	 */
	private decodeAccessToken(token: string): { sub: string } {
		const parts = token.split(".");
		if (parts.length !== 3) {
			throw new UnauthorizedException("유효하지 않은 토큰 형식입니다");
		}

		const payload = JSON.parse(
			Buffer.from(parts[1], "base64url").toString("utf-8"),
		);

		if (!payload.sub) {
			throw new UnauthorizedException("토큰에 sub 클레임이 없습니다");
		}

		return payload;
	}

	/**
	 * 토큰 유효성 검증 (JWKS 기반 - 쿠키에 있는 토큰이 유효한지)
	 * 만료 시간 정보를 함께 반환하여 PersistStore에서 관리할 수 있도록 함
	 */
	verifyToken(): VerifyTokenResponseDto {
		const token = this.cls.get<string>(CONTEXT_KEYS.TOKEN);
		const user = this.cls.get<UserDto | undefined>(CONTEXT_KEYS.AUTH_USER);
		if (!token) {
			throw new UnauthorizedException("토큰이 존재하지 않습니다");
		}
		// JwtAuthGuard에서 이미 JWKS로 검증됨 → 여기까지 왔으면 유효

		// JWT exp claim에서 만료 시간 추출
		const payload = this.decodeAccessToken(token);
		const accessTokenExpiresAt =
			((payload as { exp?: number }).exp || 0) * 1000; // sec → ms
		const refreshTokenExpiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30일 (추정)
		const hasFullAccess =
			user?.tenants?.some(
				(tenant) => tenant.role?.name === SYSTEM_ROLES.FULL_ACCESS,
			) ?? false;

		return {
			valid: true,
			accessTokenExpiresAt,
			refreshTokenExpiresAt,
			hasFullAccess,
		};
	}

	/**
	 * 현재 사용자의 Space 목록 조회
	 *
	 * @description tenant에 소속된 Space만 반환 (Ground 포함)
	 */
	async getMySpaces(): Promise<SpaceDto[]> {
		const user = this.cls.get<UserDto>(CONTEXT_KEYS.AUTH_USER);
		return this.getAccessibleSpacesForUser(user);
	}

	async getCurrentSpace(
		selectedSpaceId: string | undefined,
		res: Response,
	): Promise<SpaceDto | null> {
		const user = this.cls.get<UserDto>(CONTEXT_KEYS.AUTH_USER);
		const { space } = await this.reconcileSelectedSpaceCookie(
			user,
			selectedSpaceId,
			res,
		);
		return space;
	}

	async setCurrentSpace(
		dto: SetCurrentSpaceDto,
		res: Response,
	): Promise<SpaceDto> {
		const user = this.cls.get<UserDto>(CONTEXT_KEYS.AUTH_USER);
		if (!user?.tenants?.some((tenant) => tenant.spaceId === dto.spaceId)) {
			throw new ForbiddenException(
				"해당 Space를 선택할 권한이 없습니다",
			);
		}

		const spaces = await this.getAccessibleSpacesForUser(user);
		const selectedSpace = spaces.find((space) => space.id === dto.spaceId);
		if (!selectedSpace) {
			throw new BadRequestException("선택한 Space를 찾을 수 없습니다");
		}

		this.tokenService.setSelectedSpaceCookie(res, dto.spaceId);
		return selectedSpace;
	}

	/**
	 * 회원가입 처리 (OIDC 외부 - 직접 처리)
	 */
	async signUp(params: {
		name: string;
		nickname?: string;
		password: string;
		phone?: string;
		email: string;
	}) {
		const { name, nickname, password, phone, email } = params;

		const userRole = await this.rolesService.getDefaultUserRole();

		if (!userRole) {
			this.logger.error("User role not found");
			throw new BadRequestException("유저 역할이 존재하지 않습니다.");
		}

		const space = await this.spacesService.createPersonalSpace();

		const plainPassword = PlainPassword.create(password);
		const hashedPassword = await HashedPassword.fromPlain(plainPassword);

		const user = await this.usersService.createUserForSignUp({
			name,
			email,
			phone: phone ?? "",
			password: hashedPassword.value,
			spaceId: space.id,
			roleId: userRole.id,
			nickname,
		});

		// 회원가입 후 IDP 로그인으로 리다이렉트 필요 (토큰 직접 생성 불가)
		return { userId: user.id, email: user.email };
	}

	/**
	 * 비밀번호 변경
	 *
	 * CLS에서 현재 사용자 ID를 가져와 비밀번호를 변경합니다.
	 * logoutOtherDevices가 true이면 현재 세션을 제외한 다른 세션을 무효화합니다.
	 */
	async changePassword(params: {
		currentPassword: string;
		newPassword: string;
		logoutOtherDevices?: boolean;
		currentSessionId?: string;
	}): Promise<boolean> {
		const userId = this.cls.get<string>(CONTEXT_KEYS.USER_ID);
		if (!userId) {
			throw new UnauthorizedException("인증 정보가 없습니다");
		}

		await this.usersService.changePassword(
			userId,
			params.currentPassword,
			params.newPassword,
		);

		// 다른 기기 로그아웃 옵션
		if (params.logoutOtherDevices && params.currentSessionId) {
			await this.tokenStorageService.deleteOtherSessions(
				userId,
				params.currentSessionId,
			);
		}

		return true;
	}

	/**
	 * 계정 잠금 해제 (관리자 전용)
	 */
	async unlockAccount(userId: string): Promise<boolean> {
		await this.usersService.unlockAccount(userId);
		return true;
	}

	/**
	 * 비밀번호 강제 재설정 (관리자 전용)
	 * 임시 비밀번호를 생성하고 이메일로 발송합니다.
	 */
	async forceResetPassword(userId: string): Promise<boolean> {
		const result = await this.usersService.forceResetPassword(userId);

		// 임시 비밀번호 이메일 발송
		await this.emailService.sendTemporaryPasswordEmail(
			result.email,
			result.temporaryPassword,
		);

		// 해당 사용자의 모든 세션 무효화
		await this.tokenStorageService.deleteRefreshToken(userId);

		return true;
	}

	/**
	 * 사용자 전체 세션 무효화 (관리자 전용)
	 */
	async invalidateUserSessions(userId: string): Promise<boolean> {
		await this.tokenStorageService.deleteRefreshToken(userId);
		await this.authCacheService.invalidate(userId);
		return true;
	}

	/**
	 * 사용자 보안 정보 조회 (관리자 전용)
	 */
	async getUserSecurityInfo(userId: string) {
		return this.usersService.getSecurityInfo(userId);
	}

	/**
	 * 인증 감사 로그 목록 조회
	 */
	async getAuthAuditLogs(query: QueryAuthAuditLogDto): Promise<{
		data: GetAuditLogsResult["logs"];
		meta: PageMetaDto;
	}> {
		const skip = query.skip ?? 0;
		const take = query.take ?? 20;
		const { logs, totalCount } =
			await this.authAuditLogService.getAuditLogs(query);

		return {
			data: logs,
			meta: new PageMetaDto(skip, take, totalCount),
		};
	}

	/**
	 * 인증 감사 로그 통계 조회
	 */
	getAuthAuditLogStats() {
		return this.authAuditLogService.getStats();
	}

	// =========================================================================
	// 세션 관리 (멀티 디바이스)
	// =========================================================================

	/**
	 * 내 활성 세션 목록 조회
	 */
	async getMySessions(currentSessionId?: string): Promise<SessionInfo[]> {
		const userId = this.cls.get<string>(CONTEXT_KEYS.USER_ID);
		if (!userId) {
			throw new UnauthorizedException("인증 정보가 없습니다");
		}

		return this.tokenStorageService.getUserSessions(userId, currentSessionId);
	}

	/**
	 * 특정 세션 종료 (다른 기기)
	 */
	async revokeSession(sessionId: string): Promise<boolean> {
		const userId = this.cls.get<string>(CONTEXT_KEYS.USER_ID);
		if (!userId) {
			throw new UnauthorizedException("인증 정보가 없습니다");
		}

		// 세션의 refresh token으로 IDP revocation 호출
		const session = await this.tokenStorageService.getSessionForRevocation(
			userId,
			sessionId,
		);
		if (session?.refreshToken) {
			const clientId = this.resolveStoredClientId(
				session.clientId,
				session.clientKey,
				this.resolveClientIdFromSessionId(sessionId),
			);
			const client = await this.resolveOidcClient(clientId, {
				requireActive: false,
				requireAuthShell: false,
			});
			await this.oidcFacade.revokeToken(
				session.refreshToken,
				this.toProtocolClientConfig(client),
			);
		}

		await this.tokenStorageService.deleteSession(userId, sessionId);
		return true;
	}

	/**
	 * 현재 세션을 제외한 다른 모든 세션 종료
	 */
	async revokeOtherSessions(currentSessionId: string): Promise<number> {
		const userId = this.cls.get<string>(CONTEXT_KEYS.USER_ID);
		if (!userId) {
			throw new UnauthorizedException("인증 정보가 없습니다");
		}

		// 다른 세션들의 refresh token으로 IDP revocation 호출
		const sessions = await this.tokenStorageService.getUserSessions(
			userId,
			currentSessionId,
		);
		for (const session of sessions) {
			if (!session.isCurrent) {
				const sessionData =
					await this.tokenStorageService.getSessionForRevocation(
						userId,
						session.sessionId,
					);
				if (sessionData?.refreshToken) {
					const clientId = this.resolveStoredClientId(
						sessionData.clientId,
						sessionData.clientKey,
						this.resolveClientIdFromSessionId(session.sessionId),
					);
					const client = await this.resolveOidcClient(clientId, {
						requireActive: false,
						requireAuthShell: false,
					});
					await this.oidcFacade.revokeToken(
						sessionData.refreshToken,
						this.toProtocolClientConfig(client),
					);
				}
			}
		}

		return this.tokenStorageService.deleteOtherSessions(
			userId,
			currentSessionId,
		);
	}

	// =========================================================================
	// 쿠키 관리
	// =========================================================================

	async getClientRedirects(clientId: string): Promise<{
		loginUrl: string;
		defaultReturnTo: string;
	}> {
		const client = await this.resolveAuthShellClient(clientId, {
			requireActive: false,
		});

		return {
			loginUrl: client.loginUrl,
			defaultReturnTo: client.defaultReturnTo,
		};
	}

	private decodeOidcStateContext(
		serializedReturnTo?: string,
	): OidcStateContext {
		if (!serializedReturnTo) {
			return { clientId: DEFAULT_OIDC_CLIENT_ID };
		}

		if (!serializedReturnTo.startsWith(OIDC_STATE_CONTEXT_PREFIX)) {
			return {
				clientId: DEFAULT_OIDC_CLIENT_ID,
				returnTo: serializedReturnTo,
			};
		}

		try {
			const payload = JSON.parse(
				Buffer.from(
					serializedReturnTo.slice(OIDC_STATE_CONTEXT_PREFIX.length),
					"base64url",
				).toString("utf-8"),
			) as Partial<OidcStateContext & { clientKey?: string }>;

			return {
				clientId: this.resolveStoredClientId(
					payload.clientId,
					payload.clientKey,
				),
				returnTo:
					typeof payload.returnTo === "string" ? payload.returnTo : undefined,
			};
		} catch {
			return { clientId: DEFAULT_OIDC_CLIENT_ID };
		}
	}

	private buildSessionId(clientId: string, sessionId: string): string {
		return `${clientId}${SESSION_ID_SEPARATOR}${sessionId}`;
	}

	private resolveClientIdFromSessionId(sessionId?: string): string {
		if (!sessionId) {
			return DEFAULT_OIDC_CLIENT_ID;
		}

		const separatorIndex = sessionId.indexOf(SESSION_ID_SEPARATOR);
		if (separatorIndex <= 0) {
			return DEFAULT_OIDC_CLIENT_ID;
		}

		const candidate = sessionId.slice(0, separatorIndex);
		return this.resolveStoredClientId(candidate);
	}

	private resolveStoredClientId(
		clientId?: string,
		legacyClientKey?: string,
		fallbackClientId = DEFAULT_OIDC_CLIENT_ID,
	): string {
		if (typeof clientId === "string" && clientId.length > 0) {
			return clientId;
		}

		const legacyClientId = this.resolveLegacyClientId(legacyClientKey);
		return legacyClientId ?? fallbackClientId;
	}

	private resolveLegacyClientId(clientKey?: string): string | undefined {
		if (!clientKey) {
			return undefined;
		}

		return LEGACY_OIDC_CLIENT_ID_MAP[
			clientKey as keyof typeof LEGACY_OIDC_CLIENT_ID_MAP
		];
	}

	private async resolveAuthShellClient(
		clientId: string,
		options?: { requireActive?: boolean },
	): Promise<ResolvedOidcClient> {
		return this.resolveOidcClient(clientId, {
			requireActive: options?.requireActive,
			requireAuthShell: true,
		});
	}

	private async resolveOidcClient(
		clientId: string,
		options?: {
			requireActive?: boolean;
			requireAuthShell?: boolean;
		},
	): Promise<ResolvedOidcClient> {
		const client = options?.requireAuthShell
			? await this.oidcClientService.getAuthShellClientByClientId({
					clientId,
					requireActive: options.requireActive,
				})
			: await this.oidcClientService.getByClientId(clientId);
		const redirectUri = client.redirectUris[0];
		if (!redirectUri) {
			throw new BadRequestException("Redirect URI가 설정되지 않았습니다");
		}

		if (
			options?.requireAuthShell &&
			(!client.loginUrl || !client.defaultReturnTo)
		) {
			throw new BadRequestException(
				"로그인 셸 URL과 기본 복귀 URL이 설정되지 않았습니다",
			);
		}

		return {
			clientId: client.clientId,
			clientSecret: client.clientSecret,
			redirectUri,
			loginUrl: client.loginUrl || "/auth/login",
			defaultReturnTo: client.defaultReturnTo || "/",
		};
	}

	private toProtocolClientConfig(
		client: ResolvedOidcClient,
	): OidcClientProtocolConfig {
		return {
			clientId: client.clientId,
			clientSecret: client.clientSecret,
			redirectUri: client.redirectUri,
		};
	}

	/**
	 * 토큰 쿠키 설정
	 */
	setTokenCookies(
		res: Response,
		accessToken: string,
		refreshToken?: string,
	): void {
		this.tokenService.setAccessTokenCookie(res, accessToken);
		if (refreshToken) {
			this.tokenService.setRefreshTokenCookie(res, refreshToken);
		}
	}

	/**
	 * 세션 ID 쿠키 설정
	 */
	private setSessionIdCookie(res: Response, sessionId: string): void {
		const cookie = Cookie.forToken("7d");
		res.cookie(Token.SESSION_ID, sessionId, cookie.toExpressOptions());
	}

	/**
	 * 토큰 쿠키 삭제
	 */
	clearTokenCookies(res: Response): void {
		this.tokenService.clearTokenCookies(res);
	}

	private async getAccessibleSpacesForUser(
		user?: UserWithTenantsLike,
	): Promise<SpaceDto[]> {
		if (!user?.tenants?.length) {
			return [];
		}

		const tenantSpaceIds = this.getOrderedTenantSpaceIds(user);
		const spaces = await this.spacesService.findByIdsWithGround(tenantSpaceIds);
		const spaceById = new Map(
			spaces.map((space) => [space.id, plainToInstance(SpaceDto, space)]),
		);

		return tenantSpaceIds
			.map((spaceId) => spaceById.get(spaceId))
			.filter((space): space is SpaceDto => Boolean(space));
	}

	private async reconcileSelectedSpaceCookie(
		user: UserWithTenantsLike | undefined,
		selectedSpaceId: string | undefined,
		res: Response,
	): Promise<{ space: SpaceDto | null }> {
		const spaces = await this.getAccessibleSpacesForUser(user);
		if (spaces.length === 0) {
			this.tokenService.clearSelectedSpaceCookie(res);
			return { space: null };
		}

		const allowedSpaceIds = new Set(spaces.map((space) => space.id));
		const defaultSpaceId = this.getDefaultSelectedSpaceId(user, allowedSpaceIds);
		const nextSpaceId =
			selectedSpaceId && allowedSpaceIds.has(selectedSpaceId)
				? selectedSpaceId
				: defaultSpaceId;
		const nextSpace =
			spaces.find((space) => space.id === nextSpaceId) ?? null;

		if (!nextSpace) {
			this.tokenService.clearSelectedSpaceCookie(res);
			return { space: null };
		}

		this.tokenService.setSelectedSpaceCookie(res, nextSpace.id);
		return { space: nextSpace };
	}

	private getDefaultSelectedSpaceId(
		user: UserWithTenantsLike | undefined,
		allowedSpaceIds: Set<string>,
	): string | undefined {
		if (!user?.tenants?.length) {
			return undefined;
		}

		const fullAccessTenant = user.tenants.find(
			(tenant) => tenant.role?.name === SYSTEM_ROLES.FULL_ACCESS,
		);
		if (fullAccessTenant && allowedSpaceIds.has(fullAccessTenant.spaceId)) {
			return fullAccessTenant.spaceId;
		}

		return this.getOrderedTenantSpaceIds(user).find((spaceId) =>
			allowedSpaceIds.has(spaceId),
		);
	}

	private getOrderedTenantSpaceIds(
		user: UserWithTenantsLike,
	): string[] {
		const seen = new Set<string>();
		const orderedSpaceIds: string[] = [];

		for (const tenant of user.tenants ?? []) {
			if (!seen.has(tenant.spaceId)) {
				seen.add(tenant.spaceId);
				orderedSpaceIds.push(tenant.spaceId);
			}
		}

		return orderedSpaceIds;
	}
}
