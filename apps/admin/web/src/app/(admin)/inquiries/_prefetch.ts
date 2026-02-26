import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

interface PrefetchInquiriesParams {
	take?: number;
	skip?: number;
	status?: string;
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
	const { take = 20, skip = 0, status, category, channel, priority, search } = params;

	// 쿠키 헤더 생성 (Orval 훅 생성 후 사용)
	const cookieHeader = cookies
		.getAll()
		.map((c) => `${c.name}=${c.value}`)
		.join("; ");

	// TODO: Orval 훅 생성 후 아래 주석 해제
	// import { prefetchGetInquiriesQuery } from "@cocrepo/api";
	// await prefetchGetInquiriesQuery(
	// 	queryClient,
	// 	{ take, skip, status, category, channel, priority, search },
	// 	{ request: { headers: { Cookie: cookieHeader } } }
	// );

	// 현재는 API 훅이 생성되지 않아 로그만 출력
	console.log("[prefetchInquiriesData] Prefetch params:", {
		take,
		skip,
		status,
		category,
		channel,
		priority,
		search,
		cookieHeader: cookieHeader ? "present" : "empty",
	});
}
