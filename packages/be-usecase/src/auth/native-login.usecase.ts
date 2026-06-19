import { NativeLoginCommand } from "@cocrepo/command";
import {
	AuthCacheService,
	TokenStorageService,
	UserService,
} from "@cocrepo/service";
import {
	HttpException,
	HttpStatus,
	Inject,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";
import {
	IDP_INTERACTION_LOGIN_SERVICE,
	type InteractionLoginPort,
} from "../idp/idp.ports";
import {
	buildLoginErrorResponse,
	buildNativeAuthResponse,
	generateNativeRefreshToken,
	resolveClientIp,
	resolveUserAgent,
} from "./auth-native-session.support";
import { buildSessionId, MOBILE_NATIVE_CLIENT_ID } from "./auth-support";

@CommandHandler(NativeLoginCommand)
export class NativeLoginUseCase implements ICommandHandler<NativeLoginCommand> {
	constructor(
		private readonly usersService: UserService,
		private readonly tokenStorageService: TokenStorageService,
		private readonly authCacheService: AuthCacheService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		@Inject(IDP_INTERACTION_LOGIN_SERVICE)
		private readonly interactionLoginService: InteractionLoginPort,
	) {}

	async execute(command: NativeLoginCommand) {
		const result = await this.interactionLoginService.validateUser(
			command.input.email,
			command.input.password,
			resolveClientIp(command.req),
			resolveUserAgent(command.req),
			MOBILE_NATIVE_CLIENT_ID,
		);

		if (!result.success) {
			const statusCode =
				result.error === "ACCOUNT_LOCKED_TEMPORARY" ||
				result.error === "ACCOUNT_LOCKED_PERMANENT"
					? HttpStatus.FORBIDDEN
					: HttpStatus.UNAUTHORIZED;
			throw new HttpException(buildLoginErrorResponse(result), statusCode);
		}

		const user = await this.usersService.getByIdWithTenants(result.userId!);
		if (!user) {
			throw new UnauthorizedException("사용자를 찾을 수 없습니다");
		}

		const sessionId = buildSessionId(
			MOBILE_NATIVE_CLIENT_ID,
			this.tokenStorageService.generateSessionId(),
		);
		const refreshToken = generateNativeRefreshToken();
		await this.tokenStorageService.saveSession(
			user.id,
			sessionId,
			refreshToken,
			{
				userAgent: resolveUserAgent(command.req),
				ipAddress: resolveClientIp(command.req),
				clientId: MOBILE_NATIVE_CLIENT_ID,
			},
		);

		return buildNativeAuthResponse({
			user,
			sessionId,
			refreshToken,
			mustChangePassword: result.mustChangePassword,
			jwtService: this.jwtService,
			configService: this.configService,
			authCacheService: this.authCacheService,
		});
	}
}
