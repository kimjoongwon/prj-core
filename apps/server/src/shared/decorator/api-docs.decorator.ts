import { Token } from "@cocrepo/constants";
import { applyDecorators, HttpStatus } from "@nestjs/common";
import {
	ApiCookieAuth,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
} from "@nestjs/swagger";

// ============================================================================
// 에러 응답 문서화
// ============================================================================

/**
 * 기본 에러 메시지 정의
 * @description 상태 코드별 기본 설명 메시지
 */
const DefaultErrorMessages: Record<number, string> = {
	[HttpStatus.BAD_REQUEST]: "잘못된 요청입니다",
	[HttpStatus.UNAUTHORIZED]: "인증이 필요합니다",
	[HttpStatus.FORBIDDEN]: "접근 권한이 없습니다",
	[HttpStatus.NOT_FOUND]: "리소스를 찾을 수 없습니다",
	[HttpStatus.CONFLICT]: "리소스 충돌이 발생했습니다",
	[HttpStatus.UNPROCESSABLE_ENTITY]: "처리할 수 없는 요청입니다",
	[HttpStatus.INTERNAL_SERVER_ERROR]: "서버 오류가 발생했습니다",
};

/**
 * 에러 스펙 타입
 * @description 숫자(상태 코드)만 전달하면 기본 메시지 사용, 객체로 커스텀 메시지 지정 가능
 */
type ErrorSpec = number | { status: number; message: string };

/**
 * 유연한 HTTP 에러 응답 문서화 데코레이터
 *
 * @description
 * 화이트리스트 방식으로 해당 엔드포인트에서 발생 가능한 에러만 명시적으로 문서화합니다.
 * 숫자만 전달하면 기본 메시지를 사용하고, 객체로 전달하면 커스텀 메시지를 지정할 수 있습니다.
 *
 * @param errors - 에러 스펙 배열 (상태 코드 또는 { status, message } 객체)
 *
 * @example
 * // 기본 메시지 사용
 * ⁣@ApiErrors(400, 401, 404)
 *
 * @example
 * // 커스텀 메시지 지정
 * ⁣@ApiErrors(
 *   { status: 400, message: "이메일 형식이 올바르지 않습니다" },
 *   { status: 401, message: "이메일 또는 비밀번호가 일치하지 않습니다" },
 * )
 *
 * @example
 * // 혼용 사용 (기본 + 커스텀)
 * ⁣@ApiErrors(
 *   400,  // 기본 메시지
 *   { status: 404, message: "사용자를 찾을 수 없습니다" },
 * )
 */
export const ApiErrors = (...errors: ErrorSpec[]) => {
	const responses = errors.map((error) => {
		const status = typeof error === "number" ? error : error.status;
		const description =
			typeof error === "number"
				? DefaultErrorMessages[status] || "오류가 발생했습니다"
				: error.message;

		return ApiResponse({ status, description });
	});

	return applyDecorators(...responses);
};

/**
 * Public 엔드포인트용 에러 응답 (인증 불필요)
 * @description 400(잘못된 요청), 500(서버 오류)만 문서화
 *
 * @example
 * ⁣@Public()
 * ⁣@ApiPublicErrors()
 * async healthCheck() { ... }
 */
export const ApiPublicErrors = () => ApiErrors(400, 500);

/**
 * 인증 필요 조회 엔드포인트용 에러 응답
 * @description 400, 401, 404, 500 문서화
 *
 * @example
 * ⁣@Get(':id')
 * ⁣@ApiAuthReadErrors()
 * async getUser(@Param('id') id: string) { ... }
 */
export const ApiAuthReadErrors = () => ApiErrors(400, 401, 404, 500);

/**
 * 인증 필요 쓰기 엔드포인트용 에러 응답
 * @description 400, 401, 403, 404, 500 문서화
 *
 * @example
 * ⁣@Put(':id')
 * ⁣@ApiAuthWriteErrors()
 * async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) { ... }
 */
export const ApiAuthWriteErrors = () => ApiErrors(400, 401, 403, 404, 500);

/**
 * @deprecated ApiErrors 또는 프리셋 데코레이터 사용을 권장합니다
 * @see ApiErrors, ApiPublicErrors, ApiAuthReadErrors, ApiAuthWriteErrors
 *
 * 표준 HTTP 에러 응답 문서화 (모든 에러 포함)
 */
export const ApiStandardErrors = () =>
	applyDecorators(
		ApiResponse({ status: 400, description: "잘못된 요청" }),
		ApiResponse({ status: 401, description: "인증 필요" }),
		ApiResponse({ status: 403, description: "권한 없음" }),
		ApiResponse({ status: 404, description: "리소스를 찾을 수 없음" }),
		ApiResponse({ status: 500, description: "서버 오류" }),
	);

// ============================================================================
// 인증 문서화
// ============================================================================

/**
 * Access Token 쿠키 인증 문서화
 * @description @Public 데코레이터가 없는 일반 보호 엔드포인트에 사용
 * JWT Access Token이 쿠키로 전송되어야 함을 명시
 *
 * @example
 * ⁣@Get('me')
 * ⁣@ApiAuth()
 * async getMe() { ... }
 */
export const ApiAuth = () => ApiCookieAuth(Token.ACCESS);

/**
 * UUID 형식의 경로 파라미터 문서화
 * @param name - 파라미터 이름 (예: "userId", "spaceId")
 * @param description - 파라미터 설명
 */
export const ApiUUIDParam = (name: string, description: string) =>
	ApiParam({
		name,
		type: "string",
		format: "uuid",
		description,
		example: "123e4567-e89b-12d3-a456-426614174000",
	});

/**
 * 페이지네이션 쿼리 파라미터 문서화
 * skip, take 파라미터를 자동으로 문서화
 */
export const ApiPaginationQuery = () =>
	applyDecorators(
		ApiQuery({
			name: "skip",
			required: false,
			type: Number,
			description: "건너뛸 항목 수",
			example: 0,
		}),
		ApiQuery({
			name: "take",
			required: false,
			type: Number,
			description: "가져올 항목 수 (최대 50)",
			example: 20,
		}),
	);

/**
 * CRUD 작업에 대한 표준 @ApiOperation 데코레이터 집합
 * 일관된 operationId, summary, description 제공
 */
export const ApiCrudOperation = {
	/**
	 * CREATE 작업 문서화
	 * @param resource - 리소스 이름 (예: "User", "Space")
	 */
	create: (resource: string) =>
		ApiOperation({
			summary: `${resource} 생성`,
			description: `새로운 ${resource}를 생성합니다.`,
			operationId: `create${resource}`,
		}),

	/**
	 * READ (단일 조회) 작업 문서화
	 * @param resource - 리소스 이름
	 */
	getById: (resource: string) =>
		ApiOperation({
			summary: `${resource} 조회`,
			description: `ID로 특정 ${resource}를 조회합니다.`,
			operationId: `get${resource}ById`,
		}),

	/**
	 * UPDATE 작업 문서화
	 * @param resource - 리소스 이름
	 */
	updateById: (resource: string) =>
		ApiOperation({
			summary: `${resource} 수정`,
			description: `ID로 특정 ${resource}를 수정합니다.`,
			operationId: `update${resource}ById`,
		}),

	/**
	 * SOFT DELETE 작업 문서화
	 * @param resource - 리소스 이름
	 */
	removeById: (resource: string) =>
		ApiOperation({
			summary: `${resource} 삭제 (소프트)`,
			description: `ID로 특정 ${resource}를 논리 삭제합니다 (복구 가능).`,
			operationId: `remove${resource}ById`,
		}),

	/**
	 * HARD DELETE 작업 문서화
	 * @param resource - 리소스 이름
	 */
	deleteById: (resource: string) =>
		ApiOperation({
			summary: `${resource} 삭제 (하드)`,
			description: `ID로 특정 ${resource}를 물리 삭제합니다 (복구 불가).`,
			operationId: `delete${resource}ById`,
		}),

	/**
	 * LIST (목록 조회) 작업 문서화
	 * @param resource - 리소스 이름
	 */
	list: (resource: string) =>
		ApiOperation({
			summary: `${resource} 목록 조회`,
			description: `쿼리 조건에 따라 ${resource} 목록을 조회합니다.`,
			operationId: `get${resource}sByQuery`,
		}),
};
