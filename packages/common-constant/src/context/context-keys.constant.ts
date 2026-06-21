/**
 * ClsService에서 사용하는 컨텍스트 키 상수
 */
export const CONTEXT_KEYS = {
	NAMESPACE: "request",
	AUTH_USER: "request.user_key",
	USER_ID: "request.userId",
	LANGUAGE: "request.language_key",
	TENANT: "request.tenant_key",
	/** 현재 요청 Tenant ID (x-tenant-id 헤더) */
	TENANT_ID: "request.tenant_id",
	TOKEN: "request.token_key",
	/** 현재 세션 ID (sessionId 쿠키) */
	SESSION_ID: "request.session_id",
	SERVICE_NAME: "request.service_name_key",
	/** 현재 Tenant에서 파생된 Space ID - undefined이면 선택되지 않은 상태 */
	SPACE_ID: "request.space_id",
	/** SpaceScopeInterceptor가 계산한 최종 Space IDs (데코레이터 기반)
	 * - undefined: 슈퍼매니저 (전체 조회)
	 * - [id1, id2, ...]: Tenant 기반 필터링
	 */
	EFFECTIVE_SPACE_IDS: "request.effective_space_ids",
} as const;

/**
 * HTTP 요청 헤더 키 상수
 */
export const REQUEST_HEADER_KEYS = {
	LANGUAGE: "x-language",
	REFRESH_TOKEN: "x-refresh-token",
	TENANT_ID: "x-tenant-id",
} as const;
