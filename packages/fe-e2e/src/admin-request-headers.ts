import { getAdminAccessToken } from "./admin-access-token";

/** 쿠키 인증 상태 변경 API는 신뢰된 Origin을 요구한다(core-api 보안 계약). */
const ADMIN_WEB_ORIGIN = new URL(
	process.env.E2E_ADMIN_BASE_URL ?? "http://localhost:3000",
).origin;

export function getAdminRequestHeaders(headers: Record<string, string> = {}) {
	return {
		...headers,
		Authorization: headers.Authorization ?? `Bearer ${getAdminAccessToken()}`,
		Origin: headers.Origin ?? ADMIN_WEB_ORIGIN,
	};
}
