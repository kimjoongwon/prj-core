import {
	prefetchGetTemplateQuery,
	prefetchGetTemplatesQuery,
} from "@cocrepo/api";
import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

interface PrefetchAIFormTemplatesParams {
	take?: number;
	skip?: number;
}

export async function prefetchAIFormTemplatesData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
	params: PrefetchAIFormTemplatesParams = {},
) {
	const { take = 20, skip = 0 } = params;

	await prefetchGetTemplatesQuery(
		queryClient,
		{ take, skip },
		{
			request: withServerCookies(cookies),
		},
	);
}

export async function prefetchAIFormTemplateDetailData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
	templateId: string,
) {
	await prefetchGetTemplateQuery(queryClient, templateId, {
		request: withServerCookies(cookies),
	});
}
