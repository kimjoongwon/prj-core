import { LogoutNativeMobileSessionCommand } from "@cocrepo/command";
import { TokenStorageService } from "@cocrepo/service";
import { NativeRefreshToken, SessionId } from "@cocrepo/vo";
import { Logger, UnauthorizedException } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import { decodeAccessToken } from "../oidc/decode-access-token";
import { extractBearerToken } from "../oidc/extract-bearer-token";

@CommandHandler(LogoutNativeMobileSessionCommand)
export class LogoutNativeMobileSessionUseCase {
	private readonly logger = new Logger(LogoutNativeMobileSessionUseCase.name);

	constructor(private readonly tokenStorageService: TokenStorageService) {}

	async execute(command: LogoutNativeMobileSessionCommand) {
		let sessionId: SessionId;
		let refreshToken: NativeRefreshToken | null;
		try {
			sessionId = SessionId.fromString(command.sessionId);
			refreshToken = command.refreshToken
				? NativeRefreshToken.create(command.refreshToken)
				: null;
		} catch {
			throw new UnauthorizedException("리프레시 토큰이 유효하지 않습니다");
		}
		const lookup = await this.tokenStorageService.getSessionBySessionId(
			sessionId.value,
		);
		if (
			lookup &&
			refreshToken &&
			lookup.session.refreshToken !== refreshToken.value
		) {
			throw new UnauthorizedException("리프레시 토큰이 유효하지 않습니다");
		}

		const accessToken = extractBearerToken(command.authorizationHeader);
		if (accessToken) {
			try {
				const payload = decodeAccessToken(accessToken);
				if (lookup && payload.sub !== lookup.userId) {
					throw new UnauthorizedException(
						"세션 사용자와 토큰 사용자가 다릅니다",
					);
				}

				const expSeconds = payload.exp ?? 0;
				const remainingSeconds = expSeconds - Math.floor(Date.now() / 1000);
				if (remainingSeconds > 0) {
					await this.tokenStorageService.addToBlacklist(
						accessToken,
						remainingSeconds,
					);
				}
			} catch (error) {
				if (error instanceof UnauthorizedException) {
					throw error;
				}
				this.logger.warn(`모바일 로그아웃 토큰 정리 실패: ${error}`);
			}
		}

		if (lookup) {
			await this.tokenStorageService.deleteSession(
				lookup.userId,
				lookup.sessionId,
			);
		}
		return true;
	}
}
