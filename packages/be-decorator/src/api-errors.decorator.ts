import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

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
