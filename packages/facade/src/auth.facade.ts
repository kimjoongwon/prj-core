import { CONTEXT_KEYS } from "@cocrepo/constant";
import {
	SpaceDto,
	TokenRefreshResponseDto,
	UserDto,
	VerifyTokenResponseDto,
} from "@cocrepo/dto";
import {
	AuthCacheService,
	RolesService,
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
import { ConfigService } from "@nestjs/config";
import * as crypto from "node:crypto";
import { plainToInstance } from "class-transformer";
import { Response } from "express";
import { ClsService } from "nestjs-cls";

interface OidcServerConfig {
	issuer: string;
	jwksUri: string;
	clientId: string;
	clientSecret: string;
	redirectUri: string;
}

interface OidcTokenResponse {
	access_token: string;
	refresh_token?: string;
	id_token?: string;
	token_type: string;
	expires_in: number;
	scope?: string;
}

/**
 * 인증 Facade
 * OIDC 기반 인증 처리 - IDP에서 발급한 토큰을 관리
 *
 * ✅ Service Layer를 통해 데이터 접근
 * ❌ Prisma 직접 호출 금지
 */
@Injectable()
export class AuthFacade {
	logger: Logger = new Logger(AuthFacade.name);
	private readonly oidcConfig: OidcServerConfig;

	constructor(
		private usersService: UsersService,
		private rolesService: RolesService,
		private spacesService: SpacesService,
		private tokenService: TokenService,
		private tokenStorageService: TokenStorageService,
		private authCacheService: AuthCacheService,
		private configService: ConfigService,
		private cls: ClsService,
	) {
		this.oidcConfig = this.configService.get<OidcServerConfig>("oidc") || {
			issuer: "http://localhost:3007",
			jwksUri: "http://localhost:3007/oidc/jwks",
			clientId: "prj-core-admin",
			clientSecret: "admin-secret-change-in-production",
			redirectUri: "http://localhost:3000/api/v1/auth/callback",
		};
	}

	/**
	 * OIDC Authorization URL 생성
	 * state(CSRF 방지) + PKCE(code_verifier/code_challenge) 적용
	 */
	async getAuthorizationUrl(): Promise<string> {
		const state = crypto.randomBytes(32).toString("hex");

		// PKCE: code_verifier 생성 → SHA256 해시 → code_challenge
		const codeVerifier = crypto.randomBytes(32).toString("base64url");
		const codeChallenge = crypto
			.createHash("sha256")
			.update(codeVerifier)
			.digest("base64url");

		// state와 code_verifier를 함께 Redis에 저장
		await this.tokenStorageService.saveOidcState(state, codeVerifier);

		const params = new URLSearchParams({
			response_type: "code",
			client_id: this.oidcConfig.clientId,
			redirect_uri: this.oidcConfig.redirectUri,
			scope: "openid profile email roles",
			state,
			code_challenge: codeChallenge,
			code_challenge_method: "S256",
		});

		return `${this.oidcConfig.issuer}/oidc/auth?${params.toString()}`;
	}

	/**
	 * OIDC Callback 처리 - Authorization Code → Token 교환
	 * state 검증(CSRF 방지) + PKCE code_verifier 적용
	 * HttpOnly 쿠키에 토큰을 저장하고 반환값 없음 (리다이렉트는 Controller에서 처리)
	 */
	async handleOidcCallback(
		code: string,
		state: string,
		res: Response,
	): Promise<void> {
		// OIDC state 검증 + PKCE code_verifier 조회 (일회용 - 검증 후 즉시 소비)
		const codeVerifier =
			await this.tokenStorageService.validateAndConsumeOidcState(state);
		if (!codeVerifier) {
			throw new UnauthorizedException(
				"OIDC state 검증에 실패했습니다",
			);
		}

		// IDP token endpoint에 code + code_verifier 교환
		const tokenResponse = await this.exchangeCodeForTokens(
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

		// HttpOnly 쿠키에 토큰 저장 (유일한 쿠키 설정 지점)
		this.setTokenCookies(
			res,
			tokenResponse.access_token,
			tokenResponse.refresh_token,
		);
	}

	/**
	 * IDP Token Endpoint에 Authorization Code + PKCE code_verifier 교환
	 */
	private async exchangeCodeForTokens(
		code: string,
		codeVerifier: string,
	): Promise<OidcTokenResponse> {
		const tokenUrl = `${this.oidcConfig.issuer}/oidc/token`;

		const body = new URLSearchParams({
			grant_type: "authorization_code",
			code,
			redirect_uri: this.oidcConfig.redirectUri,
			client_id: this.oidcConfig.clientId,
			client_secret: this.oidcConfig.clientSecret,
			code_verifier: codeVerifier,
		});

		const response = await fetch(tokenUrl, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: body.toString(),
		});

		if (!response.ok) {
			const errorBody = await response.text();
			this.logger.error(
				`IDP token exchange failed: ${response.status} ${errorBody}`,
			);
			throw new UnauthorizedException("토큰 교환에 실패했습니다");
		}

		return response.json() as Promise<OidcTokenResponse>;
	}

	/**
	 * IDP Token Endpoint에 Refresh Token 교환
	 */
	async refreshTokenWithIdp(
		refreshToken: string,
		res: Response,
	): Promise<TokenRefreshResponseDto> {
		if (!refreshToken) {
			throw new UnauthorizedException("리프레시 토큰이 존재하지 않습니다");
		}

		const tokenUrl = `${this.oidcConfig.issuer}/oidc/token`;

		const body = new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: refreshToken,
			client_id: this.oidcConfig.clientId,
			client_secret: this.oidcConfig.clientSecret,
		});

		const response = await fetch(tokenUrl, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: body.toString(),
		});

		if (!response.ok) {
			const errorBody = await response.text();
			this.logger.error(
				`IDP token refresh failed: ${response.status} ${errorBody}`,
			);
			throw new UnauthorizedException("토큰 갱신에 실패했습니다");
		}

		const tokenResponse =
			(await response.json()) as OidcTokenResponse;

		// 사용자 정보 조회
		const payload = this.decodeAccessToken(tokenResponse.access_token);
		const user = await this.usersService.getByIdWithTenants(payload.sub);

		if (!user) {
			throw new UnauthorizedException("사용자를 찾을 수 없습니다");
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
	 * 로그아웃 - IDP 토큰 Revocation + 쿠키 삭제
	 */
	async logoutWithCookie(
		accessToken: string | undefined,
		res: Response,
	): Promise<boolean> {
		// IDP에 토큰 무효화 요청
		if (accessToken) {
			await this.revokeToken(accessToken);
		}

		// 쿠키 삭제
		this.clearTokenCookies(res);
		res.clearCookie("tenantId");
		res.clearCookie("workspaceId");

		return true;
	}

	/**
	 * IDP Revocation Endpoint 호출
	 */
	private async revokeToken(token: string): Promise<void> {
		const revocationUrl = `${this.oidcConfig.issuer}/oidc/token/revocation`;

		const body = new URLSearchParams({
			token,
			client_id: this.oidcConfig.clientId,
			client_secret: this.oidcConfig.clientSecret,
		});

		try {
			await fetch(revocationUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: body.toString(),
			});
		} catch (error) {
			this.logger.warn(`IDP token revocation failed: ${error}`);
		}
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
	 * 토큰 쿠키 삭제
	 */
	clearTokenCookies(res: Response): void {
		this.tokenService.clearTokenCookies(res);
	}
}
