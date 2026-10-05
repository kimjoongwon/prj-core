import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

/**
 * Action 설정 응답 DTO
 *
 * @description
 * Action.config에 저장되는 설정 정보를 표현합니다.
 */
export class ActionConfigDto {
	@ApiProperty({
		description: "설정 유형 (masking, format, transform)",
		example: "masking",
	})
	@Expose()
	type!: string;

	@ApiProperty({
		description: "마스킹 프리셋 (PRESET_EMAIL, PRESET_PHONE 등)",
		example: "PRESET_EMAIL",
		required: false,
	})
	@Expose()
	preset?: string;

	@ApiProperty({
		description: "커스텀 패턴 (정규식)",
		example: "^(.{3}).*(.{2})$",
		required: false,
	})
	@Expose()
	pattern?: string;

	@ApiProperty({
		description: "치환 문자열",
		example: "$1***$2",
		required: false,
	})
	@Expose()
	replacement?: string;

	@ApiProperty({
		description: "변환 규칙",
		example: "uppercase",
		required: false,
	})
	@Expose()
	rule?: string;
}
