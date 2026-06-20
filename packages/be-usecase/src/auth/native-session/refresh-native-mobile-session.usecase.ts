import { RefreshNativeMobileSessionCommand } from "@cocrepo/command";
import {
	AuthCacheService,
	TokenStorageService,
	UserService,
} from "@cocrepo/service";
import { NativeRefreshToken, SessionId } from "@cocrepo/vo";
import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CommandHandler } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";
import { buildNativeAuthResponse } from "./build-native-auth-response";

@CommandHandler(RefreshNativeMobileSessionCommand)
export class RefreshNativeMobileSessionUseCase {
	constructor(
		private readonly usersService: UserService,
		private readonly tokenStorageService: TokenStorageService,
		private readonly authCacheService: AuthCacheService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	async execute(command: RefreshNativeMobileSessionCommand) {
		let sessionId: SessionId;
		let presentedRefreshToken: NativeRefreshToken;
		try {
			sessionId = SessionId.fromString(command.input.sessionId);
			presentedRefreshToken = NativeRefreshToken.create(
				command.input.refreshToken,
			);
		} catch {
			throw new UnauthorizedException("리프레시 토큰이 유효하지 않습니다");
		}
		const lookup = await this.tokenStorageService.getSessionBySessionId(
			sessionId.value,
		);
		if (
			!lookup ||
			lookup.session.refreshToken !== presentedRefreshToken.value
		) {
			throw new UnauthorizedException("리프레시 토큰이 유효하지 않습니다");
		}

		const user = await this.usersService.getByIdWithTenants(lookup.userId);
		if (!user) {
			throw new UnauthorizedException("사용자를 찾을 수 없습니다");
		}

		const refreshToken = NativeRefreshToken.generate().value;
		await this.tokenStorageService.updateSession(
			lookup.userId,
			lookup.sessionId,
			refreshToken,
		);

		return buildNativeAuthResponse({
			user,
			sessionId: lookup.sessionId,
			refreshToken,
			jwtService: this.jwtService,
			configService: this.configService,
			authCacheService: this.authCacheService,
		});
	}
}
