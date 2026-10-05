import { QueryClient } from "@tanstack/react-query";
import {
	deserializeQueryCacheData,
	serializeQueryCacheData,
} from "./query-cache-serializer";

/**
 * admin-web 공용 QueryClient 팩토리.
 *
 * 브라우저 싱글턴(providers)과 (authenticated) 라우트 그룹의 서버 prefetch가
 * 같은 직렬화 계약(superjson)과 staleTime을 쓴다. 서버가 dehydrate한 캐시를
 * 클라이언트가 같은 모양으로 복원해야 하므로 생성 경로를 하나로 유지한다.
 */
export function makeAdminQueryClient() {
	return new QueryClient({
		defaultOptions: {
			dehydrate: {
				serializeData: serializeQueryCacheData,
			},
			hydrate: {
				deserializeData: deserializeQueryCacheData,
			},
			queries: {
				// SSR 하이드레이션 직후 클라이언트가 즉시 refetch하지 않게 한다.
				staleTime: 60 * 1000,
			},
		},
	});
}
