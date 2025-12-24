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
} as const;
