import {
	LoginPayloadDto,
	SignUpPayloadDto,
} from "@cocrepo/dto";
import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthDomain } from "../domain/auth.domain";
import { UsersService } from "../resources/users.service";
import { TokenService } from "../utils";

/**
 * 인증 Facade (Facade 패턴)
 * 도메인 로직 + 유틸리티 서비스 조합
 */
@Injectable()
export class AuthFacade {
	logger: Logger = new Logger(AuthFacade.name);

	constructor(
		private authDomain: AuthDomain,
		private usersService: UsersService,
		private jwtService: JwtService,
		private tokenService: TokenService,
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
	 */
	async getNewToken(refreshToken: string) {
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
		const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
			await this.tokenService.generateTokensWithStorage({ userId });

		return {
			newAccessToken,
			newRefreshToken,
		};
	}

	/**
	 * 사용자 검증 (도메인 로직 위임)
	 */
	async validateUser(email: string, password: string) {
		return this.authDomain.validateUser(email, password);
	}

	/**
	 * 회원가입 (도메인 로직 위임)
	 */
	async signUp(signUpPayloadDto: SignUpPayloadDto) {
		return this.authDomain.signUp(signUpPayloadDto);
	}

	/**
	 * 로그인 (도메인 로직 위임)
	 */
	async login(loginPayloadDto: LoginPayloadDto) {
		const result = await this.authDomain.login(loginPayloadDto);

		// Refresh Token을 Redis에 저장
		await this.tokenService.generateTokensWithStorage({
			userId: result.user.id,
		});

		return result;
	}

	/**
	 * 로그아웃 - 토큰 무효화
	 */
	async logout(userId: string, accessToken?: string): Promise<void> {
		await this.tokenService.invalidateTokens(userId, accessToken);
		this.logger.log(`사용자 로그아웃: userId=${userId}`);
	}

	/**
	 * Access Token 블랙리스트 확인
	 */
	async isTokenBlacklisted(accessToken: string): Promise<boolean> {
		return this.tokenService.isTokenBlacklisted(accessToken);
	}
}
