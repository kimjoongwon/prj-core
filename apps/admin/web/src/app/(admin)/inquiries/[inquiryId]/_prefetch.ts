import {
	prefetchGetInquiryByIdQuery,
	prefetchGetInquiryMessagesQuery,
	prefetchGetInquiryParticipantsQuery,
} from "@cocrepo/api/core/inquiries";

import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * 문의 상세 페이지 데이터 프리페치
 */
export async function prefetchInquiryDetailData(
	queryClient: QueryClient,
	cookieStore: ReadonlyRequestCookies,
	inquiryId: string,
) {
	await Promise.all([
		prefetchGetInquiryByIdQuery(queryClient, inquiryId, {
			request: withServerCookies(cookieStore),
		}),
		prefetchGetInquiryMessagesQuery(queryClient, inquiryId, {
			request: withServerCookies(cookieStore),
		}),
		prefetchGetInquiryParticipantsQuery(queryClient, inquiryId, {
			request: withServerCookies(cookieStore),
		}),
	]);
}
