/**
 * ClsService에서 사용하는 컨텍스트 키 상수
 */
export const CONTEXT_KEYS = {
	NAMESPACE: "request",
	AUTH_USER: "request.user_key",
	USER_ID: "request.userId",
	LANGUAGE: "request.language_key",
	TENANT: "request.tenant_key",
	TOKEN: "request.token_key",
	SERVICE_NAME: "request.service_name_key",
	/** 요청된 Space ID (X-Space-ID 헤더) - undefined이면 모든 데이터 조회 */
	SPACE_ID: "request.space_id",
} as const;
