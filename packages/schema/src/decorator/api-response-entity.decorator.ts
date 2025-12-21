import { applyDecorators, HttpCode, HttpStatus, Type } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, getSchemaPath } from "@nestjs/swagger";
import { Token } from "../constant/token.constant";
import { ResponseEntity } from "../entity/response.entity";

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

	// Primitive 타입은 ApiExtraModels에 등록하지 않음
	const decorators = isPrimitive
		? [
				ApiExtraModels(ResponseEntity),
				ApiResponse({
					status: httpStatus,
					schema: { allOf },
					headers,
				}),
				HttpCode(httpStatus),
			]
		: [
				ApiExtraModels(ResponseEntity, dataDto),
				ApiResponse({
					status: httpStatus,
					schema: { allOf },
					headers,
				}),
				HttpCode(httpStatus),
			];

	return applyDecorators(...decorators);
};
