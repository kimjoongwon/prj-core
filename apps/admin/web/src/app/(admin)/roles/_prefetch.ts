import { prefetchGetRolesQuery } from "@cocrepo/api";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * 역할 목록 데이터 프리페치
 */
export async function prefetchRolesData(
	queryClient: QueryClient,
	cookieStore: ReadonlyRequestCookies,
) {
	const cookieHeader = cookieStore
		.getAll()
		.map((c) => `${c.name}=${c.value}`)
		.join("; ");

	await prefetchGetRolesQuery(queryClient, {
		request: {
			headers: {
				Cookie: cookieHeader,
			},
		},
	});
}
