import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsObject } from "class-validator";

/**
 * 템플릿 미리보기 요청 DTO
 *
 * 변수에 값을 넣어 미리보기 결과를 확인합니다.
 */
export class PreviewTemplateDto {
	@ApiProperty({
		description: "변수 키-값 맵",
		type: "object",
		additionalProperties: { type: "string" },
		example: { userName: "홍길동", companyName: "코코레포" },
	})
	@IsNotEmpty({ message: "변수 맵을 입력해주세요" })
	@IsObject({ message: "변수 맵은 객체 형식이어야 합니다" })
	variables!: Record<string, string>;
}
