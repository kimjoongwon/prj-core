import { ClassField } from "@cocrepo/decorator";
import type { IPageMeta } from "@cocrepo/type";
import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

/**
 * 응답 확장 필드 인터페이스
 * 필요한 API만 선택적으로 사용합니다.
 */
export interface ResponseExtras {
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

/** 확장 필드 키 목록 */
export const RESPONSE_EXTRA_KEYS = [
	"stats",
	"filters",
	"actions",
	"aggregations",
	"summary",
] as const;

/**
 * API 응답 엔티티
 * 모든 API 응답의 표준 형식을 정의합니다.
 *
 * @template T - 응답 데이터 타입
 * @template M - 메타 정보 타입 (페이지네이션 등)
 * @template E - 확장 필드 타입 (stats, filters, actions 등)
 */
export class ResponseEntity<
	T,
	M extends IPageMeta = IPageMeta,
	E extends Partial<ResponseExtras> = Record<string, never>,
> {
	@ApiProperty({
		enum: HttpStatus,
	})
	httpStatus: HttpStatus;

	@ApiProperty()
	message: string;

	@ApiProperty({ required: false })
	data?: T;

	@ClassField(() => Object, { nullable: true, required: false })
	readonly meta?: M;

	/** 통계 정보 */
	@ClassField(() => Object, { nullable: true, required: false })
	readonly stats?: E["stats"];

	/** 적용 가능한 필터 옵션 */
	@ClassField(() => Array, { nullable: true, required: false })
	readonly filters?: E["filters"];

	/** 권한 기반 가능한 액션 */
	@ClassField(() => Array, { nullable: true, required: false })
	readonly actions?: E["actions"];

	/** 집계 데이터 */
	@ClassField(() => Object, { nullable: true, required: false })
	readonly aggregations?: E["aggregations"];

	/** 요약 정보 */
	@ClassField(() => Object, { nullable: true, required: false })
	readonly summary?: E["summary"];

	constructor(
		httpStatus: HttpStatus,
		message: string,
		data?: T,
		meta?: M,
		extras?: E,
	) {
		this.httpStatus = httpStatus;
		this.message = message;
		this.data = data;
		this.meta = meta;

		// 확장 필드 할당
		if (extras) {
			for (const key of RESPONSE_EXTRA_KEYS) {
				if (extras[key] !== undefined) {
					(this as Record<string, unknown>)[key] = extras[key];
				}
			}
		}
	}

	static WITH_SUCCESS<T>(message: string): ResponseEntity<T> {
		return new ResponseEntity(HttpStatus.OK, message || "성공");
	}

	static WITH_ERROR<T>(
		httpStatus: HttpStatus,
		message: string,
		data?: T | null,
	): ResponseEntity<T | null> {
		return new ResponseEntity(httpStatus, message || "실패", data);
	}

	static WITH_ROUTE<T>(data: T): ResponseEntity<T> {
		return new ResponseEntity(HttpStatus.OK, "성공", data);
	}

	from(data: T): ResponseEntity<T, M> {
		return new ResponseEntity(this.httpStatus, "성공", data, this.meta);
	}
}
