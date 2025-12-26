import { PRISMA_SERVICE_TOKEN } from "@cocrepo/constant";
import { ResponseEntity } from "@cocrepo/entity";
import { PrismaService, TokenService, UsersService } from "@cocrepo/service";
import { HashedPassword, PlainPassword } from "@cocrepo/vo";
import {
	BadRequestException,
	HttpStatus,
	Inject,
	Injectable,
	Logger,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

/**
 * 인증 Facade
 * 인증 관련 모든 비즈니스 로직 처리
 */
@Injectable()
export class AuthFacade {
	logger: Logger = new Logger(AuthFacade.name);

	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
		private tokenService: TokenService,
		@Inject(PRISMA_SERVICE_TOKEN)
		private prisma: PrismaService,
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
		const tokenPair = await this.tokenService.generateTokensWithStorage({
			userId,
		});

		return {
			newAccessToken: tokenPair.accessToken.value,
			newRefreshToken: tokenPair.refreshToken.value,
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

		// 유저 역할 확인
		const userRole = await this.prisma.role.findFirst({
			where: { name: "USER" },
		});

		if (!userRole) {
			this.logger.error("User role not found");
			throw new BadRequestException("유저 역할이 존재하지 않습니다.");
		}

		// Space 생성
		const space = await this.prisma.space.create({
			data: {},
		});

		// 비밀번호 해싱
		const plainPassword = PlainPassword.create(password);
		const hashedPassword = await HashedPassword.fromPlain(plainPassword);

		// 사용자 생성
		const { id: userId } = await this.prisma.user.create({
			data: {
				name,
				email,
				phone: phone ?? "",
				password: hashedPassword.value,
				tenants: {
					create: {
						main: true,
						spaceId: space.id,
						roleId: userRole.id,
					},
				},
				profiles: {
					create: {
						name,
						nickname: nickname || name,
					},
				},
			},
		});

		// 토큰 생성
		const tokenPair = this.tokenService.generateTokens({ userId });
		return tokenPair.toObject();
	}

	/**
	 * 로그인 처리
	 */
	async login(params: { email: string; password: string }) {
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

		return {
			...tokenPair.toObject(),
			user,
		};
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
