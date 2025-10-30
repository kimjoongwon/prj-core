import { LoginPayloadDto, SignUpPayloadDto } from "@cocrepo/schema";
import { Injectable, Logger } from "@nestjs/common";
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

		const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
			this.tokenService.generateTokens({
				userId,
			});

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
		return this.authDomain.login(loginPayloadDto);
	}
}
