import { CONTEXT_KEYS } from "@cocrepo/constant";
import {
	LoginResponseDto,
	TokenRefreshResponseDto,
	UserDto,
} from "@cocrepo/dto";
import { ResponseEntity, User } from "@cocrepo/entity";
import {
	RolesService,
	SpacesService,
	TokenExpiryInfo,
	TokenService,
	UsersService,
} from "@cocrepo/service";
import { HashedPassword, PlainPassword } from "@cocrepo/vo";
import {
	BadRequestException,
	HttpStatus,
	Injectable,
	Logger,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { plainToInstance } from "class-transformer";
import { Response } from "express";
import { ClsService } from "nestjs-cls";

/**
 * 인증 Facade
 * 인증 관련 모든 비즈니스 로직 처리
 *
 * ✅ Service Layer를 통해 데이터 접근
 * ❌ Prisma 직접 호출 금지
 */
@Injectable()
export class AuthFacade {
	logger: Logger = new Logger(AuthFacade.name);

	constructor(
		private usersService: UsersService,
		private rolesService: RolesService,
		private spacesService: SpacesService,
		private jwtService: JwtService,
		private tokenService: TokenService,
		private cls: ClsService,
	) {}

	/**
	 * 현재 사용자 조회 (액세스 토큰에서)
	 */
	async getCurrentUser(accessToken: string) {
		const { userId } = this.jwtService.verify<{ userId: string }>(accessToken);
		return this.usersService.getByIdWithTenants(userId);
	}

	/**
	 * 새로운 토큰 생성 (리프레시 토큰에서)
	 * 만료 시간 정보도 함께 반환
	 */
	async getNewToken(refreshToken: string): Promise<{
		newAccessToken: string;
		newRefreshToken: string;
		tokenExpiryInfo: TokenExpiryInfo;
	}> {
		const { userId } = this.jwtService.verify<{ userId: string }>(refreshToken);

		// Redis에서 Refresh Token 검증
		const isValid = await this.tokenService.validateRefreshTokenFromStorage(
			userId,
			refreshToken,
		);

		if (!isValid) {
			this.logger.warn(`유효하지 않은 Refresh Token: userId=${userId}`);
			throw new UnauthorizedException("유효하지 않은 리프레시 토큰입니다.");
		}

		// 새로운 토큰 생성 및 Redis에 저장
		const tokenPair = await this.tokenService.generateTokensWithStorage({
			userId,
		});

		// 만료 시간 계산
		const tokenExpiryInfo = this.tokenService.calculateTokenExpiryTimes();

		return {
			newAccessToken: tokenPair.accessToken.value,
			newRefreshToken: tokenPair.refreshToken.value,
			tokenExpiryInfo,
		};
	}

	/**
	 * 토큰 갱신 처리 (Public 엔드포인트용)
	 * 리프레시 토큰 검증 → 새 토큰 생성 → 쿠키 설정 → 결과 반환
	 */
	async refreshTokenWithCookie(
		refreshToken: string | undefined,
		res: Response,
	): Promise<TokenRefreshResponseDto> {
		if (!refreshToken) {
			throw new UnauthorizedException("리프레시 토큰이 존재하지 않습니다");
		}

		const { newAccessToken, newRefreshToken, tokenExpiryInfo } =
			await this.getNewToken(refreshToken);

		this.setTokenCookies(res, newAccessToken, newRefreshToken);

		const user = await this.getCurrentUser(newAccessToken);

		if (!user) {
			throw new UnauthorizedException("사용자를 찾을 수 없습니다");
		}

		return {
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
			accessTokenExpiresAt: tokenExpiryInfo.accessTokenExpiresAt,
			refreshTokenExpiresAt: tokenExpiryInfo.refreshTokenExpiresAt,
			user: plainToInstance(UserDto, user),
		};
	}

	/**
	 * 토큰 갱신 처리 (인증된 사용자용)
	 * 리프레시 토큰 검증 → 새 토큰 생성 → 쿠키 설정 → 결과 반환
	 */
	async getNewTokenWithCookie(
		refreshToken: string,
		user: User,
		res: Response,
	): Promise<TokenRefreshResponseDto> {
		const { newAccessToken, newRefreshToken, tokenExpiryInfo } =
			await this.getNewToken(refreshToken);

		this.setTokenCookies(res, newAccessToken, newRefreshToken);

		return {
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
			accessTokenExpiresAt: tokenExpiryInfo.accessTokenExpiresAt,
			refreshTokenExpiresAt: tokenExpiryInfo.refreshTokenExpiresAt,
			user: plainToInstance(UserDto, user),
		};
	}

	/**
	 * 사용자 검증 (이메일/비밀번호)
	 */
	async validateUser(email: string, password: string) {
		const user = await this.usersService.findUserForAuth(email);

		const plainPassword = PlainPassword.create(password);
		const storedHash = HashedPassword.fromHash(user?.password || "");
		const isPasswordValid = await storedHash.compare(plainPassword);

		if (!isPasswordValid) {
			this.logger.warn(
				`Invalid password attempt for user: ${email}. User: ${JSON.stringify(user)}`,
			);
			throw new UnauthorizedException(
				ResponseEntity.WITH_ERROR(
					HttpStatus.UNAUTHORIZED,
					"패스워드가 일치하지 않습니다.",
				),
			);
		}

		return user;
	}

	/**
	 * 회원가입 처리
	 */
	async signUp(params: {
		name: string;
		nickname?: string;
		password: string;
		phone?: string;
		email: string;
	}) {
		const { name, nickname, password, phone, email } = params;

		// 기본 사용자 역할 조회 (Service Layer 사용)
		const userRole = await this.rolesService.getDefaultUserRole();

		if (!userRole) {
			this.logger.error("User role not found");
			throw new BadRequestException("유저 역할이 존재하지 않습니다.");
		}

		// 개인 Space 생성 (Service Layer 사용)
		const space = await this.spacesService.createPersonalSpace();

		// 비밀번호 해싱
		const plainPassword = PlainPassword.create(password);
		const hashedPassword = await HashedPassword.fromPlain(plainPassword);

		// 사용자 생성 (Service Layer 사용)
		const user = await this.usersService.createUserForSignUp({
			name,
			email,
			phone: phone ?? "",
			password: hashedPassword.value,
			spaceId: space.id,
			roleId: userRole.id,
			nickname,
		});

		// 토큰 생성
		const tokenPair = this.tokenService.generateTokens({ userId: user.id });
		return tokenPair.toObject();
	}

	/**
	 * 로그인 처리
	 * 토큰, 만료 시간, 사용자 정보를 함께 반환
	 */
	async login(params: {
		email: string;
		password: string;
	}): Promise<LoginResponseDto> {
		const { email, password } = params;
		const user = await this.usersService.findUserForAuth(email);

		if (!user) {
			throw new UnauthorizedException("유저가 존재하지 않습니다.");
		}

		// 비밀번호 검증
		const plainPassword = PlainPassword.create(password);
		const storedHash = HashedPassword.fromHash(user.password);
		const passwordValid = await storedHash.compare(plainPassword);

		if (!passwordValid) {
			throw new BadRequestException("비밀번호가 일치하지 않습니다.");
		}

		// 토큰 생성 및 Redis 저장
		const tokenPair = await this.tokenService.generateTokensWithStorage({
			userId: user.id,
		});

		// 만료 시간 계산
		const tokenExpiryInfo = this.tokenService.calculateTokenExpiryTimes();

		return {
			accessToken: tokenPair.accessToken.value,
			refreshToken: tokenPair.refreshToken.value,
			accessTokenExpiresAt: tokenExpiryInfo.accessTokenExpiresAt,
			refreshTokenExpiresAt: tokenExpiryInfo.refreshTokenExpiresAt,
			user: plainToInstance(UserDto, user),
		};
	}

	/**
	 * 로그인 처리 및 쿠키 설정
	 */
	async loginWithCookie(
		params: { email: string; password: string },
		res: Response,
	): Promise<LoginResponseDto> {
		const result = await this.login(params);

		this.setTokenCookies(res, result.accessToken, result.refreshToken);

		return result;
	}

	/**
	 * 로그아웃 - 토큰 무효화 및 쿠키 삭제
	 */
	async logout(userId: string, accessToken?: string): Promise<void> {
		await this.tokenService.invalidateTokens(userId, accessToken);
		this.logger.log(`사용자 로그아웃: userId=${userId}`);
	}

	/**
	 * 로그아웃 및 쿠키 삭제
	 */
	async logoutWithCookie(
		userId: string | undefined,
		accessToken: string | undefined,
		res: Response,
	): Promise<boolean> {
		// Redis에서 토큰 무효화
		if (userId) {
			await this.logout(userId, accessToken);
		}

		// HttpOnly 쿠키들을 삭제 (동일한 옵션으로 삭제해야 함)
		this.clearTokenCookies(res);
		res.clearCookie("tenantId");
		res.clearCookie("workspaceId");

		return true;
	}

	/**
	 * Access Token 블랙리스트 확인
	 */
	async isTokenBlacklisted(accessToken: string): Promise<boolean> {
		return this.tokenService.isTokenBlacklisted(accessToken);
	}

	/**
	 * 토큰 쿠키 설정
	 */
	setTokenCookies(
		res: Response,
		accessToken: string,
		refreshToken: string,
	): void {
		this.tokenService.setAccessTokenCookie(res, accessToken);
		this.tokenService.setRefreshTokenCookie(res, refreshToken);
	}

	/**
	 * 토큰 쿠키 삭제
	 */
	clearTokenCookies(res: Response): void {
		this.tokenService.clearTokenCookies(res);
	}

	/**
	 * 토큰 유효성 검증
	 */
	verifyToken(): boolean {
		const token = this.cls.get<string>(CONTEXT_KEYS.TOKEN);
		if (!token) {
			throw new UnauthorizedException("토큰이 존재하지 않습니다");
		}

		return this.tokenService.verifyToken(token);
	}
}
