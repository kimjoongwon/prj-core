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
	/** 현재 세션 ID (sessionId 쿠키) */
	SESSION_ID: "request.session_id",
	SERVICE_NAME: "request.service_name_key",
	/** 요청된 Space ID (X-Space-ID 헤더) - undefined이면 모든 데이터 조회 */
	SPACE_ID: "request.space_id",
	/** SpaceCategory 위계 기반 접근 가능한 Space ID 배열 */
	ACCESSIBLE_SPACE_IDS: "request.accessible_space_ids",
	/** Space 카테고리 계층 기반 하위 Space ID 배열 (Redis 캐시) */
	DESCENDANT_SPACE_IDS: "request.descendant_space_ids",
	/** SpaceScopeInterceptor가 계산한 최종 Space IDs (데코레이터 기반) */
	EFFECTIVE_SPACE_IDS: "request.effective_space_ids",

	// 역할 정보 (현재 Tenant 기반)
	/** 현재 Tenant의 역할 이름 */
	ROLE_NAME: "request.role_name",
	/** 현재 Tenant의 역할 카테고리 이름 */
	ROLE_CATEGORY: "request.role_category",
	/** 현재 Tenant의 역할 그룹 이름 배열 */
	ROLE_GROUP_NAMES: "request.role_group_names",

	// 이용자 속성 정보 (User 기반)
	/** 이용자 카테고리 이름 */
	USER_CATEGORY: "request.user_category",
	/** 이용자 카테고리 ID */
	USER_CATEGORY_ID: "request.user_category_id",
	/** 이용자 그룹 ID 배열 */
	USER_GROUP_IDS: "request.user_group_ids",
	/** 이용자 그룹 이름 배열 */
	USER_GROUP_NAMES: "request.user_group_names",
} as const;
