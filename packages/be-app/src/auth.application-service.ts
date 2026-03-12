import { CONTEXT_KEYS, Token } from "@cocrepo/constant";
import {
	SpaceDto,
	TokenRefreshResponseDto,
	UserDto,
	VerifyTokenResponseDto,
	PageMetaDto,
	QueryAuthAuditLogDto,
} from "@cocrepo/dto";
import { OidcFacade } from "@cocrepo/integration";
import {
	AuthAuditLogService,
	GetAuditLogsResult,
	AuthCacheService,
	EmailService,
	RolesService,
	type SessionInfo,
	SpacesService,
	TokenService,
	TokenStorageService,
	UsersService,
} from "@cocrepo/service";
import { HashedPassword, PlainPassword } from "@cocrepo/vo";
import {
	BadRequestException,
	Injectable,
	Logger,
	UnauthorizedException,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Cookie } from "@cocrepo/vo";
import { Request, Response } from "express";
import { ClsService } from "nestjs-cls";

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
	logger: Logger = new Logger(AuthApplicationService.name);

	constructor(
		private usersService: UsersService,
		private rolesService: RolesService,
		private spacesService: SpacesService,
		private tokenService: TokenService,
		private tokenStorageService: TokenStorageService,
		private authCacheService: AuthCacheService,
		private authAuditLogService: AuthAuditLogService,
		private emailService: EmailService,
		private oidcFacade: OidcFacade,
		private cls: ClsService,
	) {}

	/**
	 * OIDC Authorization URL 생성
	 * state(CSRF 방지) + PKCE(code_verifier/code_challenge) 적용
	 * @param returnTo 인증 완료 후 리다이렉트할 프론트엔드 경로 (예: /admin/dashboard)
	 */
	async getAuthorizationUrl(returnTo?: string): Promise<string> {
		const { state, codeVerifier, authorizationUrl } =
			this.oidcFacade.createAuthorizationRequest(returnTo);

		// state와 code_verifier, returnTo를 함께 Redis에 저장
		await this.tokenStorageService.saveOidcState(state, codeVerifier, 600, returnTo);
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
	): Promise<string | undefined> {
		// OIDC state 검증 + PKCE code_verifier 조회 (일회용 - 검증 후 즉시 소비)
		const stateData =
			await this.tokenStorageService.validateAndConsumeOidcState(state);
		if (!stateData) {
			throw new UnauthorizedException(
				"OIDC state 검증에 실패했습니다",
			);
		}

		const { codeVerifier, returnTo } = stateData;

		// IDP token endpoint에 code + code_verifier 교환
		const tokenResponse = await this.oidcFacade.exchangeCodeForTokens(
			code,
			codeVerifier,
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
		const sessionId = this.tokenStorageService.generateSessionId();
		if (tokenResponse.refresh_token) {
			await this.tokenStorageService.saveSession(
				payload.sub,
				sessionId,
				tokenResponse.refresh_token,
				{
					userAgent: req.headers["user-agent"] || "unknown",
					ipAddress: req.ip || req.socket.remoteAddress || "unknown",
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

		return returnTo;
	}

	async refreshTokenWithIdp(
		refreshToken: string,
		sessionId: string | undefined,
		res: Response,
	): Promise<TokenRefreshResponseDto> {
		if (!refreshToken) {
			throw new UnauthorizedException("리프레시 토큰이 존재하지 않습니다");
		}

		const tokenResponse = await this.oidcFacade.refreshTokens(refreshToken);

		// 사용자 정보 조회
		const payload = this.decodeAccessToken(tokenResponse.access_token);
		const user = await this.usersService.getByIdWithTenants(payload.sub);

		if (!user) {
			throw new UnauthorizedException("사용자를 찾을 수 없습니다");
		}

		// 세션 활동 시간 및 refresh token 업데이트
		if (sessionId) {
			const newRefreshToken =
				tokenResponse.refresh_token || refreshToken;
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
			// 1. IDP에 토큰 무효화 요청 (best-effort)
			await this.oidcFacade.revokeToken(accessToken);

			try {
				// 2. Access Token 블랙리스트 등록 (JwtAuthGuard에서 차단)
				const payload = this.decodeAccessToken(accessToken);
				const expSeconds = (payload as { exp?: number }).exp ?? 0;
				const remainingSeconds =
					expSeconds - Math.floor(Date.now() / 1000);
				if (remainingSeconds > 0) {
					await this.tokenStorageService.addToBlacklist(
						accessToken,
						remainingSeconds,
					);
				}

				// 3. 현재 세션 삭제 (Redis)
				if (sessionId) {
					await this.tokenStorageService.deleteSession(
						payload.sub,
						sessionId,
					);
				} else {
					// sessionId가 없으면 사용자 기준으로 세션을 정리합니다.
					await this.tokenStorageService.deleteRefreshToken(
						payload.sub,
					);
				}
			} catch (error) {
				this.logger.warn(`로그아웃 토큰 정리 실패: ${error}`);
			}
		}

		// 4. 쿠키 삭제
		this.clearTokenCookies(res);
		res.clearCookie(Token.SESSION_ID);
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
		if (!token) {
			throw new UnauthorizedException("토큰이 존재하지 않습니다");
		}
		// JwtAuthGuard에서 이미 JWKS로 검증됨 → 여기까지 왔으면 유효

		// JWT exp claim에서 만료 시간 추출
		const payload = this.decodeAccessToken(token);
		const accessTokenExpiresAt = ((payload as { exp?: number }).exp || 0) * 1000; // sec → ms
		const refreshTokenExpiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30일 (추정)

		return { valid: true, accessTokenExpiresAt, refreshTokenExpiresAt };
	}

	/**
	 * 현재 사용자의 Space 목록 조회
	 *
	 * @description tenant에 소속된 Space만 반환 (Ground 포함)
	 */
	async getMySpaces(): Promise<SpaceDto[]> {
		const user = this.cls.get<UserDto>(CONTEXT_KEYS.AUTH_USER);
		if (!user?.tenants) {
			return [];
		}

		const tenantSpaceIds = Array.from(
			new Set(user.tenants.map((t) => t.spaceId)),
		);

		const spaces = await this.spacesService.findByIdsWithGround(
			tenantSpaceIds,
		);

		return spaces.map((space) => plainToInstance(SpaceDto, space));
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
	async getAuthAuditLogs(
		query: QueryAuthAuditLogDto,
	): Promise<{
		logs: GetAuditLogsResult["logs"];
		meta: PageMetaDto;
	}> {
		const skip = query.skip ?? 0;
		const take = query.take ?? 20;
		const { logs, totalCount } = await this.authAuditLogService.getAuditLogs(
			query,
		);

		return {
			logs,
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

		return this.tokenStorageService.getUserSessions(
			userId,
			currentSessionId,
		);
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
			await this.oidcFacade.revokeToken(session.refreshToken);
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
					await this.oidcFacade.revokeToken(sessionData.refreshToken);
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
}
