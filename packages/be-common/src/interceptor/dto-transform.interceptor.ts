import {
	DTO_CLASS_METADATA,
	DTO_EXCLUDE_FIELDS_METADATA,
	DTO_IS_ARRAY_METADATA,
	SKIP_DTO_TRANSFORM,
} from "@cocrepo/decorator";
import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	Logger,
	type NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { transformToDto } from "../util/dto-transform.util";
import { isWrappedResponse } from "../util/response.util";

/**
 * Entity를 자동으로 DTO로 변환하는 Interceptor
 *
 * @description
 * - @ApiResponseEntity 데코레이터의 메타데이터를 읽어 DTO 클래스 정보 추출
 * - Controller가 반환한 Entity를 자동으로 DTO로 변환
 * - ResponseEntityInterceptor 이전에 실행되어야 함
 *
 * @example
 * // Controller에서 더 이상 수동 변환 불필요
 * @Get(':id')
 * @ApiResponseEntity(UserDto, HttpStatus.OK)
 * async getUser(@Param('id') id: string) {
 *   return await this.service.getById(id); // Entity 반환 → 자동으로 DTO 변환됨
 * }
 */
@Injectable()
export class DtoTransformInterceptor implements NestInterceptor {
	private readonly logger = new Logger(DtoTransformInterceptor.name);

	constructor(private readonly reflector: Reflector) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const handler = context.getHandler();

		// @SkipDtoTransform 데코레이터가 있으면 변환 스킵
		const skipTransform = this.reflector.get<boolean>(
			SKIP_DTO_TRANSFORM,
			handler,
		);
		if (skipTransform) {
			return next.handle();
		}

		// 메타데이터에서 DTO 클래스 정보 추출
		const dtoClass = this.reflector.get(DTO_CLASS_METADATA, handler);
		const isArray = this.reflector.get(DTO_IS_ARRAY_METADATA, handler) ?? false;
		const excludeFields =
			this.reflector.get<string[]>(DTO_EXCLUDE_FIELDS_METADATA, handler) ?? [];

		// DTO 클래스 메타데이터가 없으면 변환 스킵
		if (!dtoClass) {
			return next.handle();
		}

		return next.handle().pipe(
			map((value) => {
				try {
					return this.transformValue(value, dtoClass, isArray, excludeFields);
				} catch (error) {
					this.logger.error(
						`DTO 변환 실패, 원본 반환: ${error instanceof Error ? error.message : String(error)}`,
					);
					return value; // fallback: 원본 반환
				}
			}),
		);
	}

	/**
	 * 반환값을 DTO로 변환 (WrappedResponse 처리 포함)
	 */
	private transformValue(
		value: unknown,
		dtoClass: any,
		isArray: boolean,
		excludeFields: string[],
	): unknown {
		// null/undefined 처리
		if (value === null || value === undefined) {
			return value;
		}

		// WrappedResponse 처리 (wrapResponse 함수로 감싼 경우)
		if (isWrappedResponse(value)) {
			return {
				...value,
				data: this.transformData(value.data, dtoClass, isArray, excludeFields),
			};
		}

		// plain { data, meta } 응답도 data 필드만 DTO 변환해 보존합니다.
		if (
			value &&
			typeof value === "object" &&
			!Array.isArray(value) &&
			"data" in (value as Record<string, unknown>)
		) {
			const record = value as Record<string, unknown>;
			return {
				...record,
				data: this.transformData(record.data, dtoClass, isArray, excludeFields),
			};
		}

		// 직접 데이터 변환
		return this.transformData(value, dtoClass, isArray, excludeFields);
	}

	/**
	 * 실제 데이터를 DTO로 변환
	 */
	private transformData(
		data: unknown,
		dtoClass: any,
		isArray: boolean,
		excludeFields: string[],
	): unknown {
		if (data === null || data === undefined) {
			return data;
		}

		// 배열 처리 - 항상 변환 시도 (Repository가 이미 plainToInstance 호출함)
		if (isArray && Array.isArray(data)) {
			return transformToDto(dtoClass, data, {
				isArray: true,
				excludeFields,
			});
		}

		// 단일 객체 처리 - 항상 변환 시도
		if (typeof data === "object") {
			return transformToDto(dtoClass, data, { excludeFields });
		}

		// Primitive 타입은 원본 반환
		return data;
	}
}
