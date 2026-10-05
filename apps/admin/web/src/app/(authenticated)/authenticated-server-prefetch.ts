import { customFetch } from "@cocrepo/api/core/client";
import {
	type SpaceDto,
	getCurrentSpaceQueryKey,
	getGetMySpacesQueryKey,
} from "@cocrepo/api/idp/auth";
import type { GetMySpaces200 } from "@cocrepo/api/idp/model";
import type { QueryClient } from "@tanstack/react-query";
import { headers } from "next/headers";

type CurrentSpaceResponse = {
	data?: SpaceDto | null;
};

// 클라이언트 hook이 쓰는 queryKey 배열의 첫 요소가 요청 경로 그 자체다.
// 경로를 두 벌 관리하면 드리프트가 생기므로 queryKey 팩토리를 원천으로 쓴다.
const CURRENT_SPACE_PATH = getCurrentSpaceQueryKey()[0];
const MY_SPACES_PATH = getGetMySpacesQueryKey()[0];

/**
 * 서버 prefetch가 브라우저와 같은 라우팅(개발 rewrites / 운영 ingress)을
 * 거치도록 요청 origin을 재구성한다. x-forwarded-proto는 프록시 계층에서
 * 쉼표로 누적될 수 있어 첫 값을 쓴다.
 */
async function resolveRequestOrigin(): Promise<string> {
	const requestHeaders = await headers();
	const host = requestHeaders.get("host");
	if (!host) {
		throw new Error("Request host header is missing for auth prefetch.");
	}
	const forwardedProto =
		requestHeaders.get("x-forwarded-proto")?.split(",")[0]?.trim() ?? "http";
	return `${forwardedProto}://${host}`;
}

export interface AuthenticatedTenantPrefetchInput {
	queryClient: QueryClient;
	accessToken: string;
}

/**
 * (authenticated) 진입 시 테넌트 확정에 필요한 조회 2건을 서버에서 prefetch한다.
 *
 * - 클라이언트 hook(useGetCurrentSpace/useGetMySpaces)과 같은 queryKey에
 *   채우므로, 하이드레이션된 캐시를 읽어 클라이언트 마운트 이펙트의 재요청이
 *   사라진다.
 * - HttpOnly accessToken 쿠키를 Bearer 헤더로만 실는다. 서버에서
 *   token/refresh를 호출하지 않는다(토큰 회전 부수효과 + 클라이언트
 *   single-flight와 경합).
 * - prefetch 실패(예: 만료된 accessToken의 401)는 prefetchQuery가 삼키고
 *   dehydrate는 성공 쿼리만 남기므로, 클라이언트 폭포(SessionBootstrap →
 *   useTenantBootstrapFromApi)로 자연 폴백된다.
 */
export async function prefetchAuthenticatedTenantQueries({
	queryClient,
	accessToken,
}: AuthenticatedTenantPrefetchInput): Promise<void> {
	const requestOrigin = await resolveRequestOrigin();
	const authorizationHeaders = { Authorization: `Bearer ${accessToken}` };

	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: getCurrentSpaceQueryKey(),
			queryFn: () =>
				customFetch<CurrentSpaceResponse>(
					`${requestOrigin}${CURRENT_SPACE_PATH}`,
					{ method: "GET", headers: authorizationHeaders },
				),
		}),
		queryClient.prefetchQuery({
			queryKey: getGetMySpacesQueryKey(),
			queryFn: () =>
				customFetch<GetMySpaces200>(`${requestOrigin}${MY_SPACES_PATH}`, {
					method: "GET",
					headers: authorizationHeaders,
				}),
		}),
	]);
}
