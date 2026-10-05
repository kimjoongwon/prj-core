import { type ApiRequestInit, executeApiFetch } from "./apiFetchCore";

/**
 * IDP용 fetch 클라이언트.
 *
 * IDP 로그인 UI(idp/web)가 인증 서버의 공개 API(interaction, i18n catalog 등)를
 * 호출하는 전송 계층이다. 로그인 전 단계만 다루므로 세션 헤더 동기화, 토큰
 * 갱신, 401 복구 같은 세션 정책을 두지 않고 401을 그대로 호출자에게 돌려준다.
 * (로그인 화면에서 401은 자격 증명 불일치를 의미한다.) 런타임 타입 응답 변환도
 * 적용하지 않고 원본 본문을 그대로 반환한다.
 */
export const customIdpFetch = <T>(
	url: string,
	options: ApiRequestInit = {},
): Promise<T> =>
	executeApiFetch<T>(url, options, {
		applyRuntimeResponseTransform: false,
	});
