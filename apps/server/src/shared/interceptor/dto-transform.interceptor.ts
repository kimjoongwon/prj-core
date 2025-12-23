import {
	DTO_CLASS_METADATA,
	DTO_IS_ARRAY_METADATA,
	SKIP_DTO_TRANSFORM,
} from "@cocrepo/decorator";
import {
	CallHandler,
	ExecutionContext,
	Injectable,
	Logger,
	NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { isEntity, transformToDto } from "../util/dto-transform.util";
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

		// DTO 클래스 메타데이터가 없으면 변환 스킵
		if (!dtoClass) {
			return next.handle();
		}

		return next.handle().pipe(
			map((value) => {
				try {
					return this.transformValue(value, dtoClass, isArray);
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
	): unknown {
		// null/undefined 처리
		if (value === null || value === undefined) {
			return value;
		}

		// WrappedResponse 처리 (wrapResponse 함수로 감싼 경우)
		if (isWrappedResponse(value)) {
			return {
				...value,
				data: this.transformData(value.data, dtoClass, isArray),
			};
		}

		// 직접 데이터 변환
		return this.transformData(value, dtoClass, isArray);
	}

	/**
	 * 실제 데이터를 DTO로 변환
	 */
	private transformData(
		data: unknown,
		dtoClass: any,
		isArray: boolean,
	): unknown {
		if (data === null || data === undefined) {
			return data;
		}

		// 배열 처리
		if (isArray && Array.isArray(data)) {
			return data.map((item) =>
				isEntity(item) ? transformToDto(dtoClass, item) : item,
			);
		}

		// 단일 Entity 처리
		if (isEntity(data)) {
			return transformToDto(dtoClass, data);
		}

		// Entity가 아니면 원본 반환 (Primitive 타입, 이미 DTO 등)
		return data;
	}
}
