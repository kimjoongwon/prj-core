import { StringField } from "@cocrepo/decorator/field";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsObject } from "class-validator";

/**
 * 템플릿 발송 테스트 요청 DTO
 *
 * 수신자에게 변수를 치환한 메시지를 테스트 발송합니다.
 */
export class SendTestTemplateDto {
	@StringField({
		description: "수신자 (이메일 주소 / 전화번호 / 디바이스 토큰)",
	})
	recipient!: string;

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
