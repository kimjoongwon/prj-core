export interface UsableIdTokenHintCriteria {
	clientId: string;
	issuer: string;
	nowSeconds?: number;
}

/**
 * 세션 레코드에 보관된 ID Token이 end_session의 id_token_hint로 OP 검증을
 * 통과할 수 있는지 iss/aud/exp 클레임으로 미리 판정한다. OP는 id_token_hint를
 * 엄격하게 검증해 하나라도 실패하면 확인 화면 대신 invalid_request로 요청
 * 전체를 끊는다. ID Token 수명(기본 1시간)이 로그인 세션보다 짧아 오래된
 * 세션의 토큰은 여기서 걸러지며, 걸러지면 null을 돌려 호출자가 client_id만
 * 담은 확인 화면 경유(end_session 폴백)로 보내게 한다.
 */
export function resolveUsableIdTokenHint(
	idToken: string | null | undefined,
	criteria: UsableIdTokenHintCriteria,
): string | null {
	if (!idToken) {
		return null;
	}

	const parts = idToken.split(".");
	if (parts.length !== 3) {
		return null;
	}

	let payload: { iss?: unknown; aud?: unknown; exp?: unknown };
	try {
		payload = JSON.parse(
			Buffer.from(parts[1], "base64url").toString("utf-8"),
		);
	} catch {
		return null;
	}

	const expiresAtSeconds = typeof payload.exp === "number" ? payload.exp : 0;
	const nowSeconds = criteria.nowSeconds ?? Math.floor(Date.now() / 1000);
	if (expiresAtSeconds <= nowSeconds) {
		return null;
	}
	if (payload.iss !== criteria.issuer) {
		return null;
	}
	const audiences = Array.isArray(payload.aud)
		? payload.aud
		: typeof payload.aud === "string"
			? [payload.aud]
			: [];
	if (!audiences.includes(criteria.clientId)) {
		return null;
	}
	return idToken;
}
