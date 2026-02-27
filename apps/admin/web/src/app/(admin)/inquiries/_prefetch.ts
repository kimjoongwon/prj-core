import {
	prefetchGetInquiriesQuery,
	prefetchGetInquiryStatsQuery,
} from "@cocrepo/api";
import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

interface PrefetchInquiriesParams {
	take?: number;
	skip?: number;
	inquiryStatus?: string;
	category?: string;
	channel?: string;
	priority?: string;
	search?: string;
}

/**
 * Inquiries 데이터 프리페칭 함수
 * SSR 시점에 데이터를 미리 조회하여 클라이언트로 전달합니다.
 *
 * @requires Orval API 훅 생성 후 아래 import 추가 필요:
 * import { prefetchGetInquiriesQuery } from "@cocrepo/api";
 *
 * @example
 * // Orval 훅 생성 후 아래와 같이 변경:
 * await prefetchGetInquiriesQuery(
 *   queryClient,
 *   { take, skip, status, category, channel, priority, search },
 *   { request: { headers: { Cookie: cookieHeader } } }
 * );
 */
export async function prefetchInquiriesData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
	params: PrefetchInquiriesParams = {},
) {
	const {
		take = 20,
		skip = 0,
		inquiryStatus,
		category,
		channel,
		priority,
		search,
	} = params;

	await Promise.all([
		prefetchGetInquiriesQuery(
			queryClient,
			{
				take,
				skip,
				inquiryStatus: inquiryStatus as
					| "NEW"
					| "OPEN"
					| "IN_PROGRESS"
					| "WAITING_CUSTOMER"
					| "RESOLVED"
					| "CLOSED"
					| "ESCALATED"
					| undefined,
				category: category as
					| "GENERAL"
					| "DELIVERY"
					| "PAYMENT"
					| "REFUND"
					| "PRODUCT"
					| "ACCOUNT"
					| "TECHNICAL"
					| "COMPLAINT"
					| "OTHER"
					| undefined,
				channel: channel as
					| "WEB"
					| "EMAIL"
					| "CHAT"
					| "SMS"
					| "PHONE"
					| "WALK_IN"
					| undefined,
				priority: priority as "LOW" | "NORMAL" | "HIGH" | "URGENT" | undefined,
				search,
			},
			{ request: withServerCookies(cookies) },
		),
		prefetchGetInquiryStatsQuery(queryClient, {
			request: withServerCookies(cookies),
		}),
	]);
}
