import { Token } from "@cocrepo/constant";
import {
	applyDecorators,
	HttpCode,
	HttpStatus,
	SetMetadata,
	type Type,
} from "@nestjs/common";
import { ApiExtraModels, ApiResponse, getSchemaPath } from "@nestjs/swagger";
import {
	DTO_CLASS_METADATA,
	DTO_EXCLUDE_FIELDS_METADATA,
	DTO_IS_ARRAY_METADATA,
	RESPONSE_MESSAGE_METADATA,
} from "./constants/metadata.constants";

/**
 * API 응답 엔티티 데코레이터 옵션
 */
export interface ApiResponseEntityOptions<TDto = any> {
	/** 배열 응답 여부 */
	isArray?: boolean;
	/** Set-Cookie 헤더 포함 여부 */
	withSetCookie?: boolean;
	/** 커스텀 메타 DTO (페이지네이션) */
	metaDto?: Type<unknown>;
	/** 통계 정보 DTO */
	statsDto?: Type<unknown>;
	/** 필터 옵션 DTO */
	filtersDto?: Type<unknown>;
	/** 가능한 액션 DTO */
	actionsDto?: Type<unknown>;
	/** 집계 데이터 DTO */
	aggregationsDto?: Type<unknown>;
	/** 요약 정보 DTO */
	summaryDto?: Type<unknown>;
	/** 응답에서 제외할 필드 목록 (타입 안전) */
	exclude?: ReadonlyArray<keyof TDto>;
}

/**
 * Primitive 타입을 OpenAPI 스키마로 변환
 */
const getPrimitiveSchema = (
	dataDto: Type<unknown>,
): { type: string } | null => {
	if (dataDto === Boolean) return { type: "boolean" };
	if (dataDto === String) return { type: "string" };
	if (dataDto === Number) return { type: "number" };
	return null;
};

/**
 * data 필드의 스키마를 생성 (primitive 또는 DTO 참조)
 */
const getDataSchema = (
	dataDto: Type<unknown>,
	isArray?: boolean,
): Record<string, unknown> => {
	const primitiveSchema = getPrimitiveSchema(dataDto);

	if (primitiveSchema) {
		return isArray
			? { type: "array", items: primitiveSchema }
			: primitiveSchema;
	}

	return isArray
		? { type: "array", items: { $ref: getSchemaPath(dataDto) } }
		: { $ref: getSchemaPath(dataDto), nullable: true };
};

/**
 * 기본 페이지네이션 스키마 (metaDto가 없을 때 사용)
 */
const getDefaultPaginationSchema = (): Record<string, unknown> => ({
	type: "object",
	properties: {
		total: { type: "number", description: "전체 항목 수" },
		page: { type: "number", description: "현재 페이지" },
		limit: { type: "number", description: "페이지당 항목 수" },
		totalPages: { type: "number", description: "전체 페이지 수" },
	},
});

/**
 * API 응답 엔티티 데코레이터
 * Swagger 문서에 응답 스키마를 자동으로 생성합니다.
 *
 * @param dataDto - 응답 데이터의 DTO 타입
 * @param httpStatus - HTTP 상태 코드 (기본값: 200)
 * @param options - 추가 옵션 (isArray, metaDto, statsDto, exclude 등)
 *
 * @example
 * // 기본 사용
 * @ApiResponseEntity(UserDto, HttpStatus.OK)
 *
 * // 리스트 응답 (커스텀 meta + stats)
 * @ApiResponseEntity(UserDto, HttpStatus.OK, {
 *   isArray: true,
 *   metaDto: UserPaginationMetaDto,
 *   statsDto: UserStatsDto
 * })
 *
 * // 특정 필드 제외
 * @ApiResponseEntity(ActionDto, HttpStatus.OK, {
 *   isArray: true,
 *   exclude: ['config', 'description'] as const
 * })
 */
export const ApiResponseEntity = <DataDto extends Type<unknown>>(
	dataDto: DataDto,
	httpStatus: HttpStatus = HttpStatus.OK,
	options?: ApiResponseEntityOptions<InstanceType<DataDto>>,
) => {
	const isPrimitive = getPrimitiveSchema(dataDto) !== null;

	// 기본 속성 정의
	const properties: Record<string, unknown> = {
		httpStatus: {
			type: "number",
			nullable: false,
			example: httpStatus,
		},
		message: { type: "string", nullable: false },
		data: getDataSchema(dataDto, options?.isArray),
	};

	// meta 필드 추가 (metaDto가 있으면 참조, 없고 isArray면 기본 스키마)
	if (options?.metaDto) {
		properties.meta = { $ref: getSchemaPath(options.metaDto) };
	} else if (options?.isArray) {
		properties.meta = getDefaultPaginationSchema();
	}

	// 확장 필드들 추가
	if (options?.statsDto) {
		properties.stats = { $ref: getSchemaPath(options.statsDto) };
	}
	if (options?.filtersDto) {
		properties.filters = {
			type: "array",
			items: { $ref: getSchemaPath(options.filtersDto) },
		};
	}
	if (options?.actionsDto) {
		properties.actions = {
			type: "array",
			items: { $ref: getSchemaPath(options.actionsDto) },
		};
	}
	if (options?.aggregationsDto) {
		properties.aggregations = { $ref: getSchemaPath(options.aggregationsDto) };
	}
	if (options?.summaryDto) {
		properties.summary = { $ref: getSchemaPath(options.summaryDto) };
	}

	const allOf = [{ properties }];

	const headers = options?.withSetCookie
		? {
				"Set-Cookie": {
					description: `${Token.ACCESS}, ${Token.REFRESH} 쿠키가 HttpOnly로 설정됩니다.`,
					schema: {
						type: "string",
						example: `${Token.ACCESS}=eyJhbGc...; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900`,
					},
				},
			}
		: undefined;

	// ApiExtraModels에 등록할 DTO 수집
	const extraModels: Type<unknown>[] = [];
	if (!isPrimitive) {
		extraModels.push(dataDto);
	}
	if (options?.metaDto) extraModels.push(options.metaDto);
	if (options?.statsDto) extraModels.push(options.statsDto);
	if (options?.filtersDto) extraModels.push(options.filtersDto);
	if (options?.actionsDto) extraModels.push(options.actionsDto);
	if (options?.aggregationsDto) extraModels.push(options.aggregationsDto);
	if (options?.summaryDto) extraModels.push(options.summaryDto);

	// 데코레이터 구성
	const decorators: Array<ClassDecorator | MethodDecorator> = [];

	// ApiExtraModels 추가 (등록할 모델이 있을 때만)
	if (extraModels.length > 0) {
		decorators.push(ApiExtraModels(...extraModels));
	}

	decorators.push(
		ApiResponse({
			status: httpStatus,
			schema: { allOf },
			headers,
		}),
		HttpCode(httpStatus),
		SetMetadata(DTO_CLASS_METADATA, dataDto),
		SetMetadata(DTO_IS_ARRAY_METADATA, options?.isArray ?? false),
		SetMetadata(DTO_EXCLUDE_FIELDS_METADATA, options?.exclude ?? []),
	);

	return applyDecorators(...decorators);
};

/**
 * 응답 메시지를 커스터마이징하는 데코레이터
 * ResponseEntityInterceptor가 이 메타데이터를 읽어 응답 메시지를 설정합니다.
 *
 * @param message - 응답에 포함될 메시지
 * @example @ResponseMessage("사용자 생성 완료")
 */
export const ResponseMessage = (message: string) =>
	SetMetadata(RESPONSE_MESSAGE_METADATA, message);
