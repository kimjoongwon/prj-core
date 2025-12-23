import { Token } from "@cocrepo/constant";
import {
	applyDecorators,
	HttpCode,
	HttpStatus,
	SetMetadata,
	Type,
} from "@nestjs/common";
import { ApiExtraModels, ApiResponse, getSchemaPath } from "@nestjs/swagger";
import {
	DTO_CLASS_METADATA,
	DTO_IS_ARRAY_METADATA,
} from "./constants/metadata.constants";

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
 * API 응답 엔티티 데코레이터
 * Swagger 문서에 응답 스키마를 자동으로 생성합니다.
 *
 * @param dataDto - 응답 데이터의 DTO 타입
 * @param httpStatus - HTTP 상태 코드 (기본값: 200)
 * @param options - 추가 옵션 (isArray, withSetCookie)
 */
export const ApiResponseEntity = <DataDto extends Type<unknown>>(
	dataDto: DataDto,
	httpStatus: HttpStatus = HttpStatus.OK,
	options?: { isArray?: boolean; withSetCookie?: boolean },
) => {
	const isPrimitive = getPrimitiveSchema(dataDto) !== null;

	const properties = {
		httpStatus: {
			type: "number",
			nullable: false,
			example: httpStatus,
		},
		message: { type: "string", nullable: false },
		data: getDataSchema(dataDto, options?.isArray),
	};

	const allOf = options?.isArray
		? [
				{
					properties: {
						httpStatus: properties.httpStatus,
						message: { type: "string", nullable: false },
						data: getDataSchema(dataDto, true),
						meta: {
							type: "object",
							properties: {
								skip: { type: "number", nullable: false },
								take: { type: "number", nullable: false },
								itemCount: { type: "number", nullable: false },
								pageCount: { type: "number", nullable: false },
								hasNextPage: { type: "boolean", nullable: false },
								hasPreviousPage: { type: "boolean", nullable: false },
							},
						},
					},
				},
			]
		: [
				{
					properties,
				},
			];

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

	// Primitive 타입은 ApiExtraModels에 dataDto를 등록하지 않음
	const decorators = isPrimitive
		? [
				ApiResponse({
					status: httpStatus,
					schema: { allOf },
					headers,
				}),
				HttpCode(httpStatus),
				SetMetadata(DTO_CLASS_METADATA, dataDto),
				SetMetadata(DTO_IS_ARRAY_METADATA, options?.isArray ?? false),
			]
		: [
				ApiExtraModels(dataDto),
				ApiResponse({
					status: httpStatus,
					schema: { allOf },
					headers,
				}),
				HttpCode(httpStatus),
				SetMetadata(DTO_CLASS_METADATA, dataDto),
				SetMetadata(DTO_IS_ARRAY_METADATA, options?.isArray ?? false),
			];

	return applyDecorators(...decorators);
};
