import { NativeLoginCommand } from "@cocrepo/command";
import { MOBILE_NATIVE_CLIENT_ID } from "@cocrepo/constant";
import {
	AuthCacheService,
	InteractionLoginService,
	TokenStorageService,
	UserService,
} from "@cocrepo/service";
import { resolveHttpClientIp, resolveHttpUserAgent } from "@cocrepo/toolkit";
import { NativeRefreshToken, SessionId } from "@cocrepo/vo";
import {
	HttpException,
	HttpStatus,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CommandHandler } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";
import { buildLoginErrorResponse } from "./build-login-error-response";
import { buildNativeAuthResponse } from "./build-native-auth-response";

@CommandHandler(NativeLoginCommand)
export class NativeLoginUseCase {
	constructor(
		private readonly usersService: UserService,
		private readonly tokenStorageService: TokenStorageService,
		private readonly authCacheService: AuthCacheService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly interactionLoginService: InteractionLoginService,
	) {}

	async execute(command: NativeLoginCommand) {
		const result = await this.interactionLoginService.validateUser(
			command.input.email,
			command.input.password,
			resolveHttpClientIp(command.req),
			resolveHttpUserAgent(command.req),
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

		const sessionId = SessionId.create(
			MOBILE_NATIVE_CLIENT_ID,
			this.tokenStorageService.generateSessionId(),
		).value;
		const refreshToken = NativeRefreshToken.generate().value;
		await this.tokenStorageService.saveSession(
			user.id,
			sessionId,
			refreshToken,
			{
				userAgent: resolveHttpUserAgent(command.req),
				ipAddress: resolveHttpClientIp(command.req),
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
