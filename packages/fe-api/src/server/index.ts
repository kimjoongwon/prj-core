import type { AxiosRequestConfig } from "axios";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * Next.js 서버 컴포넌트에서 쿠키를 API 요청 헤더로 변환합니다.
 *
 * @param cookies - Next.js cookies() 함수의 반환값
 * @returns Axios 요청 옵션 (Cookie 헤더 포함)
 *
 * @example
 * ```tsx
 * // 서버 컴포넌트에서 사용
 * import { cookies } from "next/headers";
 * import { withServerCookies } from "@cocrepo/api/server";
 * import { getUsers } from "@cocrepo/api";
 *
 * export default async function Page() {
 *   const cookies = await cookies();
 *   const data = await getUsers(withServerCookies(cookies));
 *   // ...
 * }
 * ```
 */
export function withServerCookies(
	cookies: ReadonlyRequestCookies,
): AxiosRequestConfig {
	const cookieHeader = cookies
		.getAll()
		.map((c) => `${c.name}=${c.value}`)
		.join("; ");

	return {
		headers: { Cookie: cookieHeader },
	};
}
