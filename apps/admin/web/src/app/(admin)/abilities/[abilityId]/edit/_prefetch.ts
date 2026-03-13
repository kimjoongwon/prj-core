import { prefetchGetAbilityByIdQuery } from "@cocrepo/api/core/abilities";

import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * 권한 수정 데이터 프리페치
 */
export async function prefetchAbilityEditData(
	queryClient: QueryClient,
	cookieStore: ReadonlyRequestCookies,
	abilityId: string,
) {
	const cookieHeader = cookieStore
		.getAll()
		.map((c) => `${c.name}=${c.value}`)
		.join("; ");

	await prefetchGetAbilityByIdQuery(queryClient, abilityId, {
		request: {
			headers: {
				Cookie: cookieHeader,
			},
		},
	});
}
