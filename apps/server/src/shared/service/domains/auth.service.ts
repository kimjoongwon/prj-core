import {
	BadRequestException,
	HttpStatus,
	Injectable,
	Logger,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
	LoginPayloadDto,
	QueryUserDto,
	ResponseEntity,
	SignUpPayloadDto,
} from "@shared/schema";
import { PrismaService } from "nestjs-prisma";
import { UsersService } from "../resources/users.service";
import { PasswordService } from "./password.service";
import { TokenService } from "./token.service";

@Injectable()
export class AuthService {
	logger: Logger = new Logger(AuthService.name);
	LOG_PREFIX = `${AuthService.name} DB_INIT`;
	constructor(
		private usersService: UsersService,
		private passwordService: PasswordService,
		private jwtService: JwtService,
		private tokenService: TokenService,
		private prisma: PrismaService,
	) {}

	async getCurrentUser(accessToken: string) {
		const { userId } = this.jwtService.verify<{ userId: string }>(accessToken);
		return this.usersService.getByIdWithTenants(userId);
	}

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

	async validateUser(email: string, password: string) {
		// Note: getFirst was replaced, using getManyByQuery - temporary workaround
		// TODO: Proper email lookup needs to be implemented in UsersService
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

	async signUp(signUpPayloadDto: SignUpPayloadDto) {
		const { name, nickname, password, phone, spaceId, email } =
			signUpPayloadDto;

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
			} as any,
		});

		return this.tokenService.generateTokens({ userId });
	}

	async login({ email, password }: LoginPayloadDto) {
		// Note: getFirst with complex includes was replaced, using getManyByQuery - temporary workaround
		// TODO: Proper email lookup needs to be implemented in UsersService
		const { users } = await this.usersService.getManyByQuery(
			new QueryUserDto(),
		);
		const user = users?.find((u: any) => u.email === email);
		// TODO: The complex include logic needs to be handled separately or service method needs adjustment

		this.logger.log(`User: ${JSON.stringify(user)}`);

		if (!user) {
			throw new UnauthorizedException("유저가 존재하지 않습니다.");
		}

		const passwordValid = await this.passwordService.validatePassword(
			password,
			user.password,
		);

		if (!passwordValid) {
			throw new BadRequestException("비밀번호가 일치하지 않습니다.");
		}

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
