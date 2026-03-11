import { prefetchGetCreateInquiryFormQuery } from "@cocrepo/api";
import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function prefetchInquiryCreateFormData(
	queryClient: QueryClient,
	cookieStore: ReadonlyRequestCookies,
) {
	await prefetchGetCreateInquiryFormQuery(queryClient, {
		request: withServerCookies(cookieStore),
	});
}
