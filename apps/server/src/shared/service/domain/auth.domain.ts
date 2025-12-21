import {
	ResponseEntity,
} from "@cocrepo/entity";
import {
	LoginPayloadDto,
	QueryUserDto,
	SignUpPayloadDto,
} from "@cocrepo/dto";
import {
	BadRequestException,
	HttpStatus,
	Injectable,
	Logger,
	UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "../resources/users.service";
import { PasswordService, PrismaService, TokenService } from "../utils";

/**
 * 인증 도메인 비즈니스 로직
 * 순수 비즈니스 로직만 담당
 */
@Injectable()
export class AuthDomain {
	logger: Logger = new Logger(AuthDomain.name);

	constructor(
		private usersService: UsersService,
		private passwordService: PasswordService,
		private tokenService: TokenService,
		private prisma: PrismaService,
	) {}

	/**
	 * 사용자 검증 (이메일/비밀번호)
	 */
	async validateUser(email: string, password: string) {
		const user = await this.usersService.getByEmail(email);

		const isPasswordValid = await this.passwordService.validatePassword(
			password,
			user?.password || "",
		);

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
	async signUp(signUpPayloadDto: SignUpPayloadDto) {
		const { name, nickname, password, phone, spaceId, email } =
			signUpPayloadDto;

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
		const hashedPassword = await this.passwordService.hashPassword(password);

		// 사용자 생성
		const { id: userId } = await this.usersService.create({
			data: {
				name,
				email,
				phone,
				password: hashedPassword,
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
		return this.tokenService.generateTokens({ userId });
	}

	/**
	 * 로그인 처리
	 */
	async login({ email, password }: LoginPayloadDto) {
		const { users } = await this.usersService.getManyByQuery(
			new QueryUserDto(),
		);
		const user = users?.find((u: any) => u.email === email);

		this.logger.log(`User: ${JSON.stringify(user)}`);

		if (!user) {
			throw new UnauthorizedException("유저가 존재하지 않습니다.");
		}

		// 비밀번호 검증
		const passwordValid = await this.passwordService.validatePassword(
			password,
			user.password,
		);

		if (!passwordValid) {
			throw new BadRequestException("비밀번호가 일치하지 않습니다.");
		}

		// 토큰 생성
		const { accessToken, refreshToken } = this.tokenService.generateTokens({
			userId: user.id,
		});

		return {
			accessToken,
			refreshToken,
			user,
		};
	}
}
