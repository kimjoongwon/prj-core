import { BooleanField, StringFieldOptional } from "@cocrepo/decorator/field";

/**
 * GET /api/reset-password/:token 응답
 */
export class TokenValidationDto {
	@BooleanField({ description: "토큰 유효 여부" })
	valid!: boolean;

	@StringFieldOptional({ description: "이메일 주소" })
	email?: string;

	@StringFieldOptional({ description: "유효하지 않은 이유" })
	reason?: string;
}
