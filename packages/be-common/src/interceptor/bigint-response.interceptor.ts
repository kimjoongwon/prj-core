import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor,
} from "@nestjs/common";
import type { Observable } from "rxjs";
import { map } from "rxjs/operators";

/**
 * REST 응답에 포함된 bigint를 JSON에서 안전한 십진 문자열로 변환합니다.
 *
 * @param value Controller와 다른 interceptor가 만든 최종 응답 값
 * @returns bigint만 문자열로 치환한 응답 값
 */
export function serializeResponseBigInts(value: unknown): unknown {
	return serializeValue(value, new WeakMap<object, unknown>());
}

/**
 * 응답 값을 순회하며 bigint를 문자열로 치환합니다.
 *
 * @param value 현재 순회 중인 값
 * @param visited 순환 참조를 보존하기 위한 원본-복제본 맵
 * @returns 변환된 값
 */
function serializeValue(
	value: unknown,
	visited: WeakMap<object, unknown>,
): unknown {
	if (typeof value === "bigint") {
		return value.toString(10);
	}

	if (value === null || typeof value !== "object") {
		return value;
	}

	if (
		value instanceof Date ||
		Buffer.isBuffer(value) ||
		typeof (value as { toJSON?: unknown }).toJSON === "function"
	) {
		return value;
	}

	const existing = visited.get(value);
	if (existing !== undefined) {
		return existing;
	}

	if (Array.isArray(value)) {
		const result: unknown[] = [];
		visited.set(value, result);
		for (const item of value) {
			result.push(serializeValue(item, visited));
		}
		return result;
	}

	const result = Object.create(Object.getPrototypeOf(value)) as Record<
		string,
		unknown
	>;
	visited.set(value, result);
	for (const [key, item] of Object.entries(value)) {
		result[key] = serializeValue(item, visited);
	}
	return result;
}

/** 최종 REST 응답의 bigint를 십진 문자열로 직렬화합니다. */
@Injectable()
export class BigIntResponseInterceptor implements NestInterceptor {
	/**
	 * 후속 handler 응답을 숫자 ID 문자열 계약에 맞게 변환합니다.
	 *
	 * @param _context 현재 요청 실행 컨텍스트
	 * @param next 다음 handler
	 * @returns bigint가 문자열로 변환된 응답 스트림
	 */
	intercept(
		_context: ExecutionContext,
		next: CallHandler,
	): Observable<unknown> {
		return next.handle().pipe(map(serializeResponseBigInts));
	}
}
