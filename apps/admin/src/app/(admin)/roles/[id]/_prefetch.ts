import { prefetchGetRoleByIdQuery } from "@cocrepo/api";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * 역할 상세 데이터 프리페치
 */
export async function prefetchRoleDetailData(
	queryClient: QueryClient,
	cookieStore: ReadonlyRequestCookies,
	id: string,
) {
	const cookieHeader = cookieStore
		.getAll()
		.map((c) => `${c.name}=${c.value}`)
		.join("; ");

	await prefetchGetRoleByIdQuery(queryClient, id, {
		request: {
			headers: {
				Cookie: cookieHeader,
			},
		},
	});
}
