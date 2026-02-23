import { prefetchGetAssetsQuery, prefetchGetFolderTreeQuery } from "@cocrepo/api";
import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

interface PrefetchAssetsParams {
	take?: number;
	skip?: number;
	folderId?: string;
	kind?: "IMAGE" | "VIDEO" | "DOCUMENT";
	search?: string;
}

/**
 * Assets 데이터 프리페칭 함수
 * SSR 시점에 데이터를 미리 조회하여 클라이언트로 전달합니다.
 */
export async function prefetchAssetsData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
	params: PrefetchAssetsParams = {},
) {
	const { take = 20, skip = 0, folderId, kind, search } = params;

	// 에셋 목록 프리페치
	await prefetchGetAssetsQuery(
		queryClient,
		{ take, skip, folderId, kind, search },
		{
			request: withServerCookies(cookies),
		},
	);

	// 폴더 트리 프리페치
	await prefetchGetFolderTreeQuery(queryClient, {
		request: withServerCookies(cookies),
	});
}
