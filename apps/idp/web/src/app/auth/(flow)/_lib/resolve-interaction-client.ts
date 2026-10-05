import type { InteractionClientDto } from "@cocrepo/api/idp/model";
import type { OidcClientLoginUi } from "@cocrepo/type";

/**
 * GET /api/interaction/:uid 응답의 클라이언트 정보를 로그인/동의 폼이 받는
 * 형태로 정규화한다. loginUi는 스키마가 느슨한({[key: string]: unknown})
 * 생성 타입이라 위젯 계약형으로 좁힌다.
 */
export function resolveInteractionClient(
	client: InteractionClientDto | null | undefined,
) {
	if (!client) {
		return null;
	}

	return {
		clientId: client.clientId,
		name: client.name,
		logoUri: client.logoUri ?? undefined,
		loginUi: (client.loginUi ?? null) as OidcClientLoginUi | null,
	};
}
