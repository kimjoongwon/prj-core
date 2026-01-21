import {
	prefetchGetActionsQuery,
	prefetchGetRolesQuery,
	prefetchGetSubjectsQuery,
} from "@cocrepo/api";
import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * Role 권한 관리 페이지에서 필요한 데이터를 서버 사이드에서 미리 가져옵니다.
 *
 * - Role 목록: Role 선택 드롭다운에 표시
 * - Subject 목록: Ability 생성/수정 시 Subject 선택에 사용
 * - Action 목록: Ability 생성/수정 시 Action 선택에 사용
 */
export async function prefetchRoleAbilitiesData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
) {
	const requestOptions = { request: withServerCookies(cookies) };

	await Promise.all([
		prefetchGetRolesQuery(queryClient, requestOptions),
		prefetchGetSubjectsQuery(queryClient, {}, requestOptions),
		prefetchGetActionsQuery(queryClient, {}, requestOptions),
	]);
}
