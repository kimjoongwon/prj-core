import {
	prefetchGetInquiryByIdQuery,
	prefetchGetInquiryMessagesQuery,
	prefetchGetInquiryParticipantsQuery,
} from "@cocrepo/api";
import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * 문의 상세 페이지 데이터 프리페치
 *
 * @requires Orval API 훅 생성 후 아래 import 추가 필요:
 * import {
 *   prefetchGetInquiryByIdQuery,
 *   prefetchGetInquiryMessagesQuery,
 *   prefetchGetParticipantsQuery,
 * } from "@cocrepo/api";
 *
 * @example
 * // Orval 훅 생성 후 아래와 같이 변경:
 * await Promise.all([
 *   prefetchGetInquiryByIdQuery(queryClient, inquiryId, { request: { headers: { Cookie: cookieHeader } } }),
 *   prefetchGetInquiryMessagesQuery(queryClient, inquiryId, { request: { headers: { Cookie: cookieHeader } } }),
 *   prefetchGetParticipantsQuery(queryClient, inquiryId, { request: { headers: { Cookie: cookieHeader } } }),
 * ]);
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
