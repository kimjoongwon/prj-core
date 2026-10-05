export const RESPONSE_WRAPPER_FLAG = Symbol("shared:response-wrapper");

/**
 * 응답 래핑 옵션
 * wrapResponse 함수에서 사용하는 옵션입니다.
 */
export interface ResponseWrapOptions<TMeta = unknown> {
	message?: string;
	status?: number;
	meta?: TMeta;

	// 확장 필드들
	/** 통계 정보 (활성/비활성 수 등) */
	stats?: unknown;
	/** 적용 가능한 필터 옵션 */
	filters?: unknown[];
	/** 권한 기반 가능한 액션 */
	actions?: unknown[];
	/** 집계 데이터 (차트 등) */
	aggregations?: Record<string, unknown>;
	/** 요약 정보 */
	summary?: Record<string, unknown>;
}

/**
 * 래핑된 응답 타입
 * ResponseEntityInterceptor에서 인식하여 ResponseEntity로 변환합니다.
 */
export type WrappedResponse<TData, TMeta = unknown> = {
	[RESPONSE_WRAPPER_FLAG]: true;
	data: TData;
	meta?: TMeta;
	message?: string;
	status?: number;

	// 확장 필드들
	stats?: unknown;
	filters?: unknown[];
	actions?: unknown[];
	aggregations?: Record<string, unknown>;
	summary?: Record<string, unknown>;
};

/**
 * 응답을 래핑하여 ResponseEntityInterceptor가 인식할 수 있는 형태로 변환합니다.
 *
 * @param data - 응답 데이터
 * @param options - 래핑 옵션 (meta, stats, filters 등)
 * @returns 래핑된 응답 객체
 *
 * @example
 * // 기본 사용
 * return wrapResponse(users, { meta });
 *
 * // stats 포함
 * return wrapResponse(users, { meta, stats });
 *
 * // 여러 확장 필드 포함
 * return wrapResponse(users, { meta, stats, filters, actions });
 */
export const wrapResponse = <TData, TMeta = unknown>(
	data: TData,
	options: ResponseWrapOptions<TMeta> = {},
): WrappedResponse<TData, TMeta> => ({
	[RESPONSE_WRAPPER_FLAG]: true,
	data,
	meta: options.meta,
	message: options.message,
	status: options.status,
	// 확장 필드들
	stats: options.stats,
	filters: options.filters,
	actions: options.actions,
	aggregations: options.aggregations,
	summary: options.summary,
});

export const isWrappedResponse = (
	value: unknown,
): value is WrappedResponse<unknown> =>
	Boolean(
		value &&
			typeof value === "object" &&
			(value as WrappedResponse<unknown>)[RESPONSE_WRAPPER_FLAG] === true,
	);
