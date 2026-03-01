import { prefetchGetInquiryUpdateFormQuery } from "@cocrepo/api";
import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function prefetchInquiryEditFormData(
	queryClient: QueryClient,
	cookieStore: ReadonlyRequestCookies,
	inquiryId: string,
) {
	await prefetchGetInquiryUpdateFormQuery(queryClient, inquiryId, {
		request: withServerCookies(cookieStore),
	});
}
