import { prefetchGetOidcClientQuery } from "@cocrepo/api";
import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * OIDC 클라이언트 수정용 데이터 프리페칭 함수
 */
export async function prefetchOidcClientEditData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
	oidcClientId: string,
) {
	await prefetchGetOidcClientQuery(queryClient, oidcClientId, {
		request: withServerCookies(cookies),
	});
}
