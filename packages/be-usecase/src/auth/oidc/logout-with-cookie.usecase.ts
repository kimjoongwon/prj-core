import { OidcClientAggregate } from "@cocrepo/aggregate";
import { OidcClient } from "@cocrepo/client";
import { LogoutWithCookieCommand } from "@cocrepo/command";
import { Token } from "@cocrepo/constant";
import { TokenService, TokenStorageService } from "@cocrepo/service";
import { Logger } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import { decodeAccessToken } from "./decode-access-token";
import { extractBearerToken } from "./extract-bearer-token";
import { resolveClientIdFromSessionId } from "./resolve-client-id-from-session-id";
import { resolveOidcClient } from "./resolve-oidc-client";
import { ResolvedOidcClient } from "./resolved-oidc-client";
import { toProtocolClientConfig } from "./to-protocol-client-config";

export interface LogoutWithCookieResult {
	/**
	 * OIDC RP-Initiated Logout(end_session) URL. 세션 레코드에 보관된
	 * ID Token이 있으면 id_token_hint로 함께 전달해 확인 없이 진행되고,
	 * 없는 세션(레거시)은 client_id만 담아 OP 확인 화면(한 번 클릭)을
	 * 거친다. 브라우저가 이 URL로 최상위 내비게이션하면 OP가 자기 세션
	 * (_session 쿠키 등)을 스스로 정리한다. OIDC 클라이언트 조회에 실패하면
	 * null이고 호출자는 자기 로그인 화면으로 이동한다.
	 */
	endSessionUrl: string | null;
}

@CommandHandler(LogoutWithCookieCommand)
export class LogoutWithCookieUseCase {
	private readonly logger = new Logger(LogoutWithCookieUseCase.name);

	constructor(
		private readonly oidcClientService: OidcClientAggregate,
		private readonly oidcClient: OidcClient,
		private readonly tokenStorageService: TokenStorageService,
		private readonly tokenService: TokenService,
	) {}

	async execute(
		command: LogoutWithCookieCommand,
	): Promise<LogoutWithCookieResult> {
		// OP end_session의 id_token_hint로 쓸 ID Token을 세션 레코드에서
		// 꺼낸다. 아래 deleteSession이 레코드를 지우기 전에 읽어야 한다.
		const sessionLookup = command.sessionId
			? await this.tokenStorageService.getSessionBySessionId(command.sessionId)
			: null;
		// 클라이언트 조회는 end_session URL 구성과 OP 토큰 폐기에만 쓴다.
		// 조회가 실패해도 RP 쿠키 정리까지 막히지 않게 best-effort로 진행한다.
		const clientId = resolveClientIdFromSessionId(command.sessionId);
		let client: ResolvedOidcClient | null = null;
		try {
			client = await resolveOidcClient(this.oidcClientService, clientId, {
				requireActive: false,
				requireLoginPage: false,
			});
		} catch (error) {
			this.logger.warn(`로그아웃용 OIDC 클라이언트 조회 실패: ${error}`);
		}
		const endSessionUrl = client
			? this.oidcClient.buildEndSessionUrl(
					sessionLookup?.session.idToken ?? null,
					{
						postLogoutRedirectUri: client.postLogoutRedirectUris[0],
						clientId: client.clientId,
					},
				)
			: null;

		const accessToken =
			command.accessTokenCookie ??
			extractBearerToken(command.authorizationHeader);
		if (accessToken) {
			if (client) {
				await this.oidcClient.revokeToken(
					accessToken,
					toProtocolClientConfig(client),
				);
			}

			try {
				const payload = decodeAccessToken(accessToken);
				const expSeconds = (payload as { exp?: number }).exp ?? 0;
				const remainingSeconds = expSeconds - Math.floor(Date.now() / 1000);
				if (remainingSeconds > 0) {
					await this.tokenStorageService.addToBlacklist(
						accessToken,
						remainingSeconds,
					);
				}

				if (command.sessionId) {
					await this.tokenStorageService.deleteSession(
						payload.sub,
						command.sessionId,
					);
				} else {
					await this.tokenStorageService.deleteRefreshToken(payload.sub);
				}
			} catch (error) {
				this.logger.warn(`로그아웃 토큰 정리 실패: ${error}`);
			}
		}

		// RP(core-api)가 소유한 쿠키만 지운다. OP 세션 쿠키(_session 등)는
		// 브라우저가 endSessionUrl로 이동할 때 OP가 직접 정리한다.
		this.tokenService.clearTokenCookies(command.res);
		command.res.clearCookie(Token.SESSION_ID);
		command.res.clearCookie(Token.LOGGED_IN);
		command.res.clearCookie("tenantId");
		command.res.clearCookie("workspaceId");

		return { endSessionUrl };
	}
}
